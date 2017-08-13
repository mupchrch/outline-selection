'use babel';

export default class OutlineSelectionView {

  constructor() {
    const CSS_CLASS = 'outline-selection';

    let outlineTopElem = document.createElement('div');
    outlineTopElem.classList.add(CSS_CLASS);
    outlineTopElem.classList.add(CSS_CLASS + '-top');

    let outlineBottomElem = document.createElement('div');
    outlineBottomElem.classList.add(CSS_CLASS);
    outlineBottomElem.classList.add(CSS_CLASS + '-bottom');

    let outlineLeftElem = document.createElement('div');
    outlineLeftElem.classList.add(CSS_CLASS);
    outlineLeftElem.classList.add(CSS_CLASS + '-left');

    let outlineRightElem = document.createElement('div');
    outlineRightElem.classList.add(CSS_CLASS);
    outlineRightElem.classList.add(CSS_CLASS + '-right');

    let outlineHolder = document.createElement('div');
    outlineHolder.classList.add(CSS_CLASS + '-container');
    outlineHolder.appendChild(outlineTopElem);
    outlineHolder.appendChild(outlineBottomElem);
    outlineHolder.appendChild(outlineLeftElem);
    outlineHolder.appendChild(outlineRightElem);
    this.outlineHolder = outlineHolder;

    this.outline = {
      top: outlineTopElem,
      bottom: outlineBottomElem,
      left: outlineLeftElem,
      right: outlineRightElem,
    }
  }

  /**
   * Attaches the outline elements to a view if not already attached.
   * @param  {View} view The view to attach the elements of the outline to.
   */
  attach(view) {
    this.view = view;
    let scrollView = scrollView = view.querySelector('.scroll-view');
    scrollView.appendChild(this.outlineHolder);
  }

  // Tear down any state and detach
  destroy() {
    this.outlineHolder.remove();
  }

  /**
   * Hides the outline elements, thus hiding the outline.
   */
  hide() {
    this.outline.top.style.display = 'none';
    this.outline.bottom.style.display = 'none';
    this.outline.left.style.display = 'none';
    this.outline.right.style.display = 'none';
  }

  /**
   * Hides the left and right of the outline. Useful for single line highlights,
   * where the sides should not be seen.
   */
  hideSides() {
    this.outline.left.style.display = 'none';
    this.outline.right.style.display = 'none';
  }

  /**
   * Shows the outline elements, thus showing the outline.
   */
  show() {
    this.outline.top.style.display = 'block';
    this.outline.bottom.style.display = 'block';
    this.outline.left.style.display = 'block';
    this.outline.right.style.display = 'block';
  }

  /**
   * Gets the view that the outline is attached to.
   * @return {View} The view that the outline is attached to.
   */
  getView() {
    return this.view;
  }

  /**
   * Sets the position of the outline elements.
   * @param {Object} topPosition    The position to set the top element to.
   *                                Contains a top and left, which are numbers.
   * @param {Object} bottomPosition The position to set the bottom element to.
   *                                Contains a top and left, which are numbers.
   * @param {Object} leftPosition   The position to set the left element to.
   *                                Contains a top and left, which are numbers.
   * @param {Object} rightPosition  The position to set the right element to.
   *                                Contains a top and left, which are numbers.
   */
  setPosition(topPosition, bottomPosition, leftPosition, rightPosition) {
    this.outline.top.style.top = (topPosition.hasOwnProperty('top')) ? topPosition.top + 'px' : null;
    this.outline.top.style.bottom = (topPosition.hasOwnProperty('bottom')) ? topPosition.botom + 'px' : null
    this.outline.top.style.left = (topPosition.hasOwnProperty('left')) ? topPosition.left + 'px' : null;
    this.outline.top.style.right = (topPosition.hasOwnProperty('right')) ? topPosition.right + 'px' : null;

    this.outline.bottom.style.top = (bottomPosition.hasOwnProperty('top')) ? bottomPosition.top + 'px' : null;
    this.outline.bottom.style.bottom = (bottomPosition.hasOwnProperty('bottom')) ? bottomPosition.bottom + 'px' : null;
    this.outline.bottom.style.left = (bottomPosition.hasOwnProperty('left')) ? bottomPosition.left + 'px' : null;
    this.outline.bottom.style.right = (bottomPosition.hasOwnProperty('right')) ? bottomPosition.right + 'px' : null;

    this.outline.left.style.top = (leftPosition.hasOwnProperty('top')) ? leftPosition.top + 'px' : null;
    this.outline.left.style.bottom = (leftPosition.hasOwnProperty('bottom')) ? leftPosition.bottom + 'px' : null;
    this.outline.left.style.left = (leftPosition.hasOwnProperty('left')) ? leftPosition.left + 'px' : null;
    this.outline.left.style.right = (leftPosition.hasOwnProperty('right')) ? leftPosition.right + 'px' : null;

    this.outline.right.style.top = (rightPosition.hasOwnProperty('top')) ? rightPosition.top + 'px' : null;
    this.outline.right.style.bottom = (rightPosition.hasOwnProperty('bottom')) ? rightPosition.bottom + 'px' : null;
    this.outline.right.style.left = (rightPosition.hasOwnProperty('left')) ? rightPosition.left + 'px' : null;
    this.outline.right.style.right = (rightPosition.hasOwnProperty('right')) ? rightPosition.right + 'px' : null;
  }

  /**
   * Sets the size of the outline elements.
   * @param {Object} topSize    The size to set the top element to. Contains a
   *                            width and height, which are numbers.
   * @param {Object} bottomSize The size to set the bottom element to. Contains
   *                            a width and height, which are numbers.
   * @param {Object} leftSize   The size to set the left element to. Contains a
   *                            width and height, which are numbers.
   * @param {Object} rightSize  The size to set the right element to. Contains a
   *                            width and height, which are numbers.
   */
  setSize(topSize, bottomSize, leftSize, rightSize) {
    this.outline.top.style.width = (topSize.hasOwnProperty('width')) ? topSize.width + 'px': null;
    this.outline.top.style.height = (topSize.hasOwnProperty('height')) ? topSize.height + 'px' : null;

    this.outline.bottom.style.width = (bottomSize.hasOwnProperty('width')) ? bottomSize.width + 'px' : null;
    this.outline.bottom.style.height = (bottomSize.hasOwnProperty('height')) ? bottomSize.height + 'px' : null;

    this.outline.left.style.width = (leftSize.hasOwnProperty('width')) ? leftSize.width + 'px' : null;
    this.outline.left.style.height = (leftSize.hasOwnProperty('height')) ? leftSize.height + 'px' : null;

    this.outline.right.style.width = (rightSize.hasOwnProperty('width')) ? rightSize.width + 'px' : null;
    this.outline.right.style.height = (rightSize.hasOwnProperty('height')) ? rightSize.height + 'px' : null;
  }

  /**
   * Sets the border radius of the outline appropriately. Some of the corners
   * need to be set and some don't.
   * @param {number} radius        The border radius size in pixels.
   * @param {boolean} isSingleLine Whether the outline will be on a single line
   *                               or on multiple lines.
   */
  setRadius(radius, isSingleLine) {
    this.outline.top.style.borderTopLeftRadius = radius + 'px';
    this.outline.top.style.borderTopRightRadius = radius + 'px';

    this.outline.bottom.style.borderBottomLeftRadius = radius + 'px';
    this.outline.bottom.style.borderBottomRightRadius = radius + 'px';

    this.outline.left.style.borderTopLeftRadius = radius + 'px';
    this.outline.left.style.borderBottomLeftRadius = radius + 'px';

    this.outline.right.style.borderTopRightRadius = radius + 'px';
    this.outline.right.style.borderBottomRightRadius = radius + 'px';

    if(isSingleLine) {
      this.outline.top.style.borderBottomLeftRadius = radius + 'px';

      this.outline.bottom.style.borderTopRightRadius = radius + 'px';
    } else {
      this.outline.top.style.borderBottomLeftRadius = 0;

      this.outline.bottom.style.borderTopRightRadius = 0;
    }
  }

  /**
   * Sets the border CSS and the opacity for the outline elements.
   * @param {string} borderCss The value to set the border CSS property to.
   *                           Value will look like '1px solid rgba(0,0,0,1)'.
   * @param {number} opacity   The value to set the opacity of the outline
   *                           elements to.
   */
  setStyle(borderCss, opacity) {
    this.outline.top.style.borderTop = borderCss;
    this.outline.top.style.borderLeft = borderCss;
    this.outline.top.style.opacity = opacity;

    this.outline.bottom.style.borderBottom = borderCss;
    this.outline.bottom.style.borderRight = borderCss;
    this.outline.bottom.style.opacity = opacity;

    this.outline.left.style.borderTop = borderCss;
    this.outline.left.style.borderLeft = borderCss;
    this.outline.left.style.opacity = opacity;

    this.outline.right.style.borderBottom = borderCss;
    this.outline.right.style.borderRight = borderCss;
    this.outline.right.style.opacity = opacity;
  }
}
