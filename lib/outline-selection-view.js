'use babel';

export default class OutlineSelectionView {

  constructor() {
    const CSS_CLASS = 'outline-selection';
    const POSITION = 'absolute';
    const Z_INDEX = 100;

    let outlineTopElem = document.createElement('div');
    outlineTopElem.classList.add(CSS_CLASS + '-top');
    outlineTopElem.style.position = POSITION;
    outlineTopElem.style.zIndex = Z_INDEX;

    let outlineBottomElem = document.createElement('div');
    outlineBottomElem.classList.add(CSS_CLASS + '-bottom');
    outlineBottomElem.style.position = POSITION;
    outlineBottomElem.style.zIndex = Z_INDEX;

    let outlineLeftElem = document.createElement('div');
    outlineLeftElem.classList.add(CSS_CLASS + '-left');
    outlineLeftElem.style.position = POSITION;
    outlineLeftElem.style.zIndex = Z_INDEX;

    let outlineRightElem = document.createElement('div');
    outlineRightElem.classList.add(CSS_CLASS + '-right');
    outlineRightElem.style.position = POSITION;
    outlineRightElem.style.zIndex = Z_INDEX;

    let outlineHolder = document.createElement('div');
    outlineHolder.classList.add(CSS_CLASS);
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
    /*console.log('--------- POSITION ---------');
    console.log('Top (t: ' + topPosition.top + ', l: ' + topPosition.left + ')');
    console.log('Bottom (t: ' + bottomPosition.top + ', l: ' + bottomPosition.left + ')');
    console.log('Left (t: ' + leftPosition.top + ', l: ' + leftPosition.left + ')');
    console.log('Right (t: ' + rightPosition.top + ', l: ' + rightPosition.left + ')');*/

    this.outline.top.style.top = topPosition.top + 'px';
    this.outline.top.style.left = topPosition.left + 'px';

    this.outline.bottom.style.top = bottomPosition.top + 'px';
    this.outline.bottom.style.left = bottomPosition.left + 'px';

    this.outline.left.style.top = leftPosition.top + 'px';
    this.outline.left.style.left = leftPosition.left + 'px';

    this.outline.right.style.top = rightPosition.top + 'px';
    this.outline.right.style.left = rightPosition.left + 'px';
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
    /*console.log('----------- SIZE -----------');
    console.log('Top (w: ' + topSize.width + ', h: ' + topSize.height + ')');
    console.log('Bottom (w: ' + bottomSize.width + ', h: ' + bottomSize.height + ')');
    console.log('Left (w: ' + leftSize.width + ', h: ' + leftSize.height + ')');
    console.log('Right (w: ' + rightSize.width + ', h: ' + rightSize.height + ')');*/

    this.outline.top.style.width = topSize.width + 'px';
    this.outline.top.style.height = topSize.height + 'px';

    this.outline.bottom.style.width = bottomSize.width + 'px';
    this.outline.bottom.style.height = bottomSize.height + 'px';

    this.outline.left.style.width = leftSize.width + 'px';
    this.outline.left.style.height = leftSize.height + 'px';

    this.outline.right.style.width = rightSize.width + 'px';
    this.outline.right.style.height = rightSize.height + 'px';
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
