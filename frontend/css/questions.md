
# CSS

## Resources

### Videos
- [Most Common CSS Interview Questions (Part1)](https://www.youtube.com/watch?v=tTLiBU9x6rQ)
- [Most Common CSS Interview Questions (Part2)](https://www.youtube.com/watch?v=PU6bQCAV9PE)




### Articles
- [Most Common CSS Interview Questions](https://css-tricks.com/how-to-prepare-for-css-specific-interview-questions/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Grid Guide](https://css-tricks.com/complete-guide-css-grid-layout/)

---

## How to Center Elements

```css
/* TODO: 1. Center inline/inline-block elements horizontally */
.parent {
  text-align: center;
}

/* TODO: 2. Center a block element horizontally */
.child {
  width: fit-content; /* or a fixed width */
  margin: 0 auto;
}

/* TODO: 3. Center using Flexbox (horizontal + vertical) */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* TODO: 4. Center using Grid (horizontal + vertical) */
.parent {
  display: grid;
  place-items: center;
}

/* TODO: 5. Center using Absolute Positioning */
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* TODO: 6. Center using Flexbox (horizontal only) */
.parent {
  display: flex;
  justify-content: center;
}

/* TODO: 7. Center using Flexbox (vertical only) */
.parent {
  display: flex;
  align-items: center;
}

/* TODO: 8. Center using Grid (horizontal only) */
.parent {
  display: grid;
  justify-items: center;
}

/* TODO: 9. Center using Grid (vertical only) */
.parent {
  display: grid;
  align-items: center;
}

/* TODO: 10. Center a single Grid item */
.child {
  justify-self: center;
  align-self: center;
}

/* TODO: 11. Center using margin auto in Flexbox */
.parent {
  display: flex;
}

.child {
  margin: auto;
}

/* TODO: 12. Center using line-height (single-line text only) */
.parent {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```


---

## Quick Reminders

### Specificity
!important > inline > id > class > element

### Flexbox
justify-content = main axis

align-items = cross axis

### Grid vs Flexbox
Grid = 2D
Flexbox = 1D

### Box Model
content → padding → border → margin


