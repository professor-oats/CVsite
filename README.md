# CVsite
Site for CV

## Appreciation list
Found a post by poeti8 in how to handle property updates of uniforms in three.js.<br />
Give him a visit:<br />
https://github.com/poeti8

## Backstory on why a book
During the courses in pentest I named a FreeBSD host running on Macbook Pro to 'blackbook', and <br />
since job applications coming up, and with the hopes that a React app would help showcasing skills *cough* <br />
I thought - let's realise this blackbook. And here it is.

## Dev Comments
What has been felt so far is that even that it was a neat idea <br />
to write this with React in the beginning, with the modular approach of having <br />
separate components, it started to affect some performance when queueing up <br />
React's handling of elements to THREE.js object updates. <br />
<br />
Note: This was noticed when I wanted the camera updates applied to fiber's Canvas through its <br />
own component, and I switched back to have it directly referenced into/linked with Canvas <br /> 
<br />

It could be far better, and easier, to just make a plain THREE.js Scene for the usual Canvas. <br />
Making this render performant on low/mid hardware brought a challenge and some decisions: <br />
Giving the user the option to turn off Particles, and especially Bloom, was a very good addition. <br />

Update 2025-01-05: <br />
Looking back now things are coming together neatly with React as long as you manage <br />
some hiccups here and there. I also just learnt, +40 hours in, how to correctly add emissiveness to materials, <br />
no idea where my brain was at before. Will we even keep the added Bloom now? <br />
