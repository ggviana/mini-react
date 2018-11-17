# Mini React

### Dependencies

The project depends on the following softwares: 

`node 8.10.x`

`npm 6.4.x`

### Building

Once the requirements are met, go to the project directory and run the following commands to build the project:

`npm install`

`npm run build`

The solution will be build on `./solution` directory

### Design process

Firstly I identified that the library was able to render DOM elements by two means: via `Component` class and a `node` function. Tackling the `node` was easy, all it had to be done was create DOM with `document.createElement` and changing the attributes accordingly.

The next step was to deal with reconciliation recursively, for that I kept both the DOM and the node definition in a single structure where I could compare and decide whats gets updated or if the node was deleted. DOM elements are reused to reduce the quantity of objects in memory.

With reconciliation completed, was time to go back to `Component` and make it hold the internal state. A internal reference is kept inside each component instance so it's easier to detect a change and re-render when `setState` is called.

I tried to keep the changes to `index.html` and `App.js` to a minimum, for that purpose I used a simple IIFE encapsulate the code and introduced a `Currency` component to handle the numbers styling.

### Technical debts

Unfortunately there is not a manner to style the range input track adequately. The part of the track that is lesser than the handle doesn't have a pseudo element implemented in Chrome and Firefox. I prioritized to not touch the `App.js` code, but it could be done if changing the original code was a option.

It's not possible to display the range labels via `content: attr(min|max)` in Firefox because by specification [self-enclosing elements cannot have after and before pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/::after#wikiArticle). That could be worked around inserting labels in the component. Nevertheless it works on other browsers.
