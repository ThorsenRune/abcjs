
# ABCJS Musical Score Editor and Midi player.

Forked from Paul Rosen [https://github.com/paulrosen/abcjs](https://github.com/paulrosen/abcjs)

ABC notation is a standard for writing musical scores.

![](https://lh5.googleusercontent.com/D55bT9E7XtPPDWCbpt7OHWXHeTfTxxe41ZMePCyHvncXomTRehEQ4ggk5JuylieTWGig3tvTzF88gKQDoHAUd-K7qTRi_Jp5Az3Nkpq3YHrHkm7dY9CwnXFCARIMmVHePzFtb2GL)

This fork of ABCJS

*  Runs in a browser - no installation is needed

*  Has a split pane view: ABC notation and Score View

*  Has the midi player

--- as in the original version, plus ---

*  The split panel can be dynamically resized

*  A number of handy shortcuts for editing has been implemented

*  Some changes to the ABC syntax interpretation

* A menu (ctrl m) for

-  ‘pause/replay current bar’ (ctrl p)

-  toggle muting of selection (ctrl m)

-  switching between one of 5 tunes (ctrl 1..9)

-  swapping horizontal/vertical layout (mouse/touch drag)

-  zooming ABC or SCORE

  

Focus has been on making it work on mobile (tablet, phone as well as pc)

  

# Use

* Change panelayout by dragging the handle (far left/right/top/down will change orientation)

* Print the score Ctl+P or Print will

#

# Syntax revisions

* Changed the syntax of ‘transpose’ to provide SCORE and MIDI transposition (e.g. “V:Cl name="Clarinet" clef=treble middle=B transpose=-2” will transpose for a Bb instrument)

* Alternative accidentals in module abc_parse.js for a more logical ABC syntax

 

    ABCCodes.sharp  =  '#♯';  //♯

	ABCCodes.flat =  'j♭';  //♭

	ABCCodes.natural  =  '=♮';  //♮



  
  

# Notes

I forked and modified this project mostly as a study of javascript, HTML5 and CSS. It's propaedeutic for a cross platform porting of a rehabilitation system: [https://github.com/ThorsenRune/LM-Android](https://github.com/ThorsenRune/LM-Android)

  

I haven't invested time on aesthetics of the coding, hence many ugly hacks.

#Acknowledgements

Thanks to:

[Paul Rosen]([https://github.com/paulrosen/abcjs](https://github.com/paulrosen/abcjs)) for the ABCJS library

[Simon Hagström]([https://github.com/shagstrom/split-pane](https://github.com/shagstrom/split-pane)) inspiring the panel resizing