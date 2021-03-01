# Project Reflection

## Problems
- A problem I could not solve in my major project is having the numbers on the home screen bounce on the bottom edge. I did not realize that the font size of a letter goes beyond the height of the actual letter displayed. I came up with a temporary solution to this issue by subtracting 10 from the font size when detecting whether or not it had reached the bottom edge. Subtracting 10 from the font size does not work perfectly with every number but it looked ok with most of them. To completely solve this issue, I suspect I would use textBounds() to find the height of the actual number and use that value instead of the font size. 
- In my code, I have a function that spaces out each of the rules on the left hand side of the screen so that no matter how many lines a certain rule took up, there would still be a space between it and the next rule. For some reason, when a rule takes up three or more lines, the space between it and the next rule is very obviously smaller than all the other spaces. I did not find a solution to this problem but I suspect it has something to do with the same issue that caused the previous issue. Something with the text size/height is probably messing up the calculation for the space to leave in between each rule.

## Things I Would Do Differently
- When I first started this project, I made the game board the entire canvas so it would be easier to manipulate the board

## Completion
- I completed everything in my Needs To Have list. The one thing I did not complete in my Nice To Have list was a feature that would let the user be able to choose between using the mouse or using the keyboard to enter the numbers.
