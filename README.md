# CVsite
Site for CV

## Appreciation list
Found a post by poeti8 in how to handle property updates of uniforms in three.js.<br />
Give him a visit:<br />
https://github.com/poeti8

## Dev Comments
What has been realised so far is that even that it was a neat idea <br />
to write this with React in the beginning, with the modular approach of having <br />
separate components, it really started to affect some performance when queueing up <br />
React's handling of elements to THREE.js object updates. <br />
<br />
Note: This was realised when I wanted the camera updates applied to fiber Canvas through its <br />
own component, and I switched back to have it directly referenced into Canvas <br /> 
<br />

It would be far better, and easier, to just make a plain THREE.js Scene for the usual Canvas. <br />
Making this render performant on low/mid hardware brought a challenge and some decisions: <br />
Giving the user the option to turn off Particles, and especially Bloom, was a very good addition. <br />
