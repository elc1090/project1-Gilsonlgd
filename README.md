# BezierCurvesUsingHTMLCanvas
 Manual implementation of Cubic Bezier Curves using HTML Canvas

### General Information
* The objective of this repository is to try to recreate the Photoshop Pen Tool using HTML Canvas for research and practice purposes only. (_Not finished yet_)
* It will be updated as I develop new stuff.

### What do i have at this point (besides bugs)
- A <s>beautiful</s> canvas
- You can click at any spot to create an Anchor Point and two angle points linked to that anchor point, if you simply hold the mouse button when creating a new Anchor Point, you will drag one angle point to where the mouse is and the other to the opposite side
- After a anchor point is created, you can drag any anchor point and angle point to any other spot inside the canvas by holding `Ctrl` and dragging a point
- Each 2 anchor points, a curve is created using 1º anchor point, its right angle point, the 2ª anchor point's left angle point and, finnaly, the 2º anchor point   
- If the canvas has 2 or more points AND you click in the first point, it will become the last point of the curve, closing the curve (only to draw, not in the array, in the array it stays in the first position)
- A `Ctrl+Z` command to erase the last point created OR reopen de curve if it is closed (note that it doesn't undo the last change on the canvas, this yet has to be done)
  
  
To understand the bezier curves a bit better:  
- The black points are the initial and ending points of the 4 point curve
- The red points are the angle points, where the curve is interpolated (the curve does not intersect with these red points)  

_It's like the black points are those "anchor points" of the Photoshop pen tool and the red points are those angle points where you can change the curvature of the line/curve you created with the anchor points._


#### TO DO
1. **[FIXED]** <s>There's a problem when clicking and dragging an anchor point: the angleLeft and angleRight switch places (????)</s>
2. **[FIXED]** <s>Need to find a way to: when the `points.length` is bigger than 1, if the user click on the inital anchor point, close the curve</s>
3. Create a canvas state buffer (use `Ctrl+Z` to go back in this state buffer and undo canvas modifications)
   - Each modification in the canvas adds another state buffer state (position) and removes the last one


