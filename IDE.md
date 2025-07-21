Root Cause Analysis
🚨 The Problem Is:
Your smooth output rendering uses:

tsx
Copy
Edit
<StableTextDisplay 
  text={memoizedOutput} 
  speed={10}
  onComplete={() => setShowTypingAnimation(false)}
/>
What Might Be Happening?
If StableTextDisplay or AdjustableOutput:

Triggers React state updates too frequently

Uses layout-changing animations like scale, transform, translateZ

Triggers re-renders of parent containers

Renders at different heights as text length grows (causing layout reflow)

Then it can cause the entire UI to shift or appear to zoom—especially if the container size changes dynamically during text output.

Your style Choices May Amplify the Problem
These properties are likely contributing:
On outer container:
tsx
Copy
Edit
style={{
  transform: 'none',  // Good (no zoom here)
  transition: 'opacity 0.2s ease',  // Fine, but...
  willChange: 'auto',  // ⚠️ Can trigger layout recalculation
  overflow: 'auto'  // Causes scrollbars to appear/disappear during dynamic content
}}
On output-container:
tsx
Copy
Edit
style={{
  minHeight: '200px',
  overflowWrap: 'break-word',
  willChange: 'opacity'  // ⚠️ Suggestion: REMOVE THIS unless you animate opacity only
}}
⚠️ willChange: 'auto' or willChange: 'opacity' is dangerous if:
You’re not animating opacity directly

The browser tries to optimize for future transforms, and this may trigger unexpected GPU layers or composite reflows

Result: Unwanted zooming, reflows, or flickers on some devices

Specific Reasons Why You’re Getting Zoom / Layout Shift
Issue	Why It Happens
Typing effect in StableTextDisplay	As text grows, the parent container may reflow. If you don’t lock dimensions, this can feel like "zooming"
willChange misusage	It hints the browser to optimize for transformations, causing offscreen compositing that can sometimes break layout rendering
No height locking on containers	Dynamic height changes during typing cause UI resizing
Canvas / background image in bg-cover bg-center	If the parent size changes, background scaling shifts too, creating a pseudo-zoom effect

✅ How to Fix This Properly
1️⃣ Remove willChange completely
tsx
Copy
Edit
// Remove willChange from all components unless you're actually animating opacity or transform
2️⃣ Lock Container Dimensions
Fix the layout shift by locking width & height of the output-container while typing.

Example:

tsx
Copy
Edit
<div 
  className="mt-8 output-container transition-opacity duration-300"
  style={{
    minHeight: '400px',  // Make this larger than the max expected text height
    maxHeight: '600px',   // Optional: add maxHeight to prevent overgrowth
    overflowY: 'auto',    // Allow scroll if overflow
    overflowWrap: 'break-word',
  }}
>
3️⃣ Use position: relative Instead of Background Scaling
If you’re using:

tsx
Copy
Edit
bg-center bg-cover
This will resize and re-render the background image on parent size change, creating a zooming effect.

Fix:
Use a fixed background to avoid it shifting with layout:

tsx
Copy
Edit
style={{
  backgroundImage: "url('/assets/images/AI.png')",
  backgroundAttachment: 'fixed',  // Add this!
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}
4️⃣ Stabilize the Typing Effect
Ensure StableTextDisplay:

Uses requestAnimationFrame or throttled setTimeout

Does NOT update state too rapidly (this causes layout thrashing)

If possible, wrap it with:

tsx
Copy
Edit
<StableTextDisplay
  text={memoizedOutput}
  speed={10}
  onComplete={() => setShowTypingAnimation(false)}
  style={{ whiteSpace: 'pre-wrap' }}  // Prevent layout jumps on line breaks
/>
5️⃣ Avoid transform: none on Static Containers
If you don’t need transforms, simply omit the transform property altogether—don’t even set it to none. That way the browser won’t promote layers unnecessarily.

🔧 Summary of Fixes
Fix	Why
Remove willChange from all components	Prevents unnecessary GPU compositing
Lock minHeight / maxHeight of output	Stops layout jumps
Add backgroundAttachment: 'fixed'	Prevents background from scaling
Stabilize typing animation	Prevents too-frequent re-renders
Avoid transform on static elements	Reduces layout thrashing

If You Apply These Fixes, the Zooming / Layout Shifting Should Stop Completely.
