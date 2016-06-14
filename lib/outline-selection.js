'use babel';

import OutlineSelectionView from './outline-selection-view';
import configSchema from './config-schema';
//import { CompositeDisposable } from 'atom';

let outlineWidth = 0;
// save previous width in case pixelRectForScreenRange width is zero
let prevSelectionWidth = 0;

export default {
  //subscriptions: null,
  config: configSchema,

  activate(state) {
    atom.workspace.observeTextEditors(function(editor) {
      let editorView = atom.views.getView(editor);

      editor.observeSelections(function(selection) {
        selection.outline = new OutlineSelectionView();
        _updateOutlineStyle(selection);
        selection.outline.attach(editorView);
        selection.outline.hide();
      });
      editor.onDidChangeSelectionRange(function(event) {
        _updateOutline(event.selection);
      });
      editorView.onDidChangeScrollTop(function() {
        let selections = editor.getSelections();
        for(let selection of selections) {
          _updateOutline(selection);
        }
      });
      editorView.onDidChangeScrollLeft(function() {
        let selections = editor.getSelections();
        for(let selection of selections) {
          _updateOutline(selection);
        }
      });
      atom.config.onDidChange('outline-selection', function() {
        let selections = editor.getSelections();
        for(let selection of selections) {
          _updateOutlineStyle(selection);
        }
      });
      editor.onDidRemoveSelection(function(selection) {
        selection.outline.destroy();
        selection.outline = null;
      });
    });
  },

  deactivate() {
    //this.outlineSelectionView.destroy();
  },

};

/**
 * Updates the CSS styling on the outline. Gets the values from the config.
 * @param  {Selection} selection The selection to update the style of. The
 *                               selection should contain an outline object.
 */
function _updateOutlineStyle(selection) {
  if(!selection.outline) {
    console.log('Selection did not have an outline associated with it. No style update.');
    return;
  }

  outlineWidth = atom.config.get('outline-selection.outlineWidth');
  let outlineStyle = atom.config.get('outline-selection.outlineStyle');
  let outlineColor = atom.config.get('outline-selection.outlineColor');
  let outlineOpacity = atom.config.get('outline-selection.outlineOpacity');

  selection.outline.setStyle(`${outlineWidth}px ${outlineStyle} rgba(${outlineColor.red},${outlineColor.green},${outlineColor.blue},${outlineColor.alpha})`, outlineOpacity);
}

/**
 * Updates the size and position of the outline. Hides the outline when no
 * seleciton exists.
 * @param  {Selection} selection The selection to update the size and position
 *                               of. The selection should contain an outline
 *                               object.
 */
function _updateOutline(selection) {
  if(!selection.outline) {
    console.log('Selection did not have an outline associated with it. No size/position update.');
    return;
  }

  let selectionRange = selection.getScreenRange();
  if (selectionRange.start.row == selectionRange.end.row && selectionRange.start.column == selectionRange.end.column) {
    // hide when there is no selection
    selection.outline.hide();
  } else {
    // show and reposition when there is a selection
    selection.outline.show();

    let editorView = selection.outline.getView();
    let pixelRect = editorView.pixelRectForScreenRange(selectionRange);
    if(pixelRect.width == 0) {
      // set the width to the previous width
      pixelRect.width = prevSelectionWidth;
    } else {
      // save previous width in case pixelRectForScreenRange width is zero
      prevSelectionWidth = pixelRect.width;
    }
    let lineHeight = selection.editor.getLineHeightInPixels();
    let editorScrollTop = editorView.getScrollTop();
    let editorScrollLeft = editorView.getScrollLeft();
    let selectionStartLeft = editorView.pixelPositionForScreenPosition(selectionRange.start).left;
    let selectionEndLeft = editorView.pixelPositionForScreenPosition(selectionRange.end).left;

    if(selectionRange.start.row == selectionRange.end.row) { // single line selection
      // CALCULATE POSITION
      let topPosition = {
        top: (pixelRect.top - editorScrollTop) - outlineWidth,
        left: (selectionStartLeft - editorScrollLeft) - outlineWidth,
      };
      let bottomPosition = {
        top: ((pixelRect.top - editorScrollTop) + pixelRect.height) - lineHeight,
        left: selectionStartLeft - editorScrollLeft,
      };
      let leftPosition = {
        top: (pixelRect.top - editorScrollTop) + lineHeight,
        left: selectionStartLeft - outlineWidth,
      };
      let rightPosition = {
        top: (pixelRect.top - editorScrollTop) - outlineWidth,
        left: selectionEndLeft - editorScrollLeft,
      };

      // CALCULATE SIZE
      let topSize = {
        width: pixelRect.width,
        height: lineHeight, // subtract the width of the outline so it doesn't overlap
      };
      let bottomSize = {
        width: selectionEndLeft - selectionStartLeft,
        height: lineHeight,
      };
      let leftSize = {
        width: 0,
        height: pixelRect.height - lineHeight,
      };
      let rightSize = {
        width: 0,
        height: pixelRect.height - lineHeight, // subtract the width of the outline so it doesn't overlap (don't want negative number)
      };

      // FIX SPECIFIC SCENARIO
      if(selectionStartLeft == 0) { // selection from start of line
        topPosition.left = selectionStartLeft - editorScrollLeft;
        topSize.width = pixelRect.width - outlineWidth;
      }

      // SET POSITION AND SIZE
      selection.outline.setPosition(topPosition, bottomPosition, leftPosition, rightPosition);
      selection.outline.setSize(topSize, bottomSize, leftSize, rightSize);
    } else if (selectionRange.start.row != selectionRange.end.row) { // multi line selection
      // CALCULATE POSITION
      let topPosition = {
        top: (pixelRect.top - editorScrollTop) - outlineWidth,
        left: (selectionStartLeft - editorScrollLeft) - outlineWidth,
      };
      let bottomPosition = {
        top: ((pixelRect.top - editorScrollTop) + pixelRect.height) - lineHeight,
        left: pixelRect.left - editorScrollLeft,
      };
      let leftPosition = {
        top: ((pixelRect.top - editorScrollTop) + lineHeight) - outlineWidth,
        left: pixelRect.left - editorScrollLeft,
      };
      let rightPosition = {
        top: pixelRect.top - editorScrollTop, // add the width of the outline so it doesn't overlap
        left: (selectionEndLeft - editorScrollLeft) + outlineWidth,
      };

      // CALCULATE SIZE
      let topSize = {
        width: (pixelRect.width - selectionStartLeft) + outlineWidth,
        height: lineHeight, // subtract the width of the outline so it doesn't overlap
      };
      let bottomSize = {
        width: selectionEndLeft - pixelRect.left,
        height: lineHeight,
      };
      let leftSize = {
        width: Math.max(0, (selectionStartLeft - pixelRect.left) - (2 * outlineWidth)),
        height: pixelRect.height - lineHeight,
      };
      let rightSize = {
        width: (pixelRect.width - selectionEndLeft) - outlineWidth,
        height: pixelRect.height - lineHeight, // subtract the width of the outline so it doesn't overlap (don't want negative number)
      };

      // FIX SPECIFIC SCENARIOS
      if(selectionStartLeft == 0) { // selection from start of line
        topPosition.left = selectionStartLeft - editorScrollLeft;
        topSize.width = pixelRect.width;
        topSize.height = lineHeight - outlineWidth;
      } else if(selectionRange.end.row - selectionRange.start.row == 1
                  && selectionStartLeft > selectionEndLeft) { // disconnected selection
        rightPosition.left = selectionStartLeft - editorScrollLeft;
        topSize.height = lineHeight + outlineWidth;
        leftSize.width = selectionEndLeft - pixelRect.left;
        rightSize.width = pixelRect.width - selectionStartLeft;
      }

      // SET POSITION AND SIZE
      selection.outline.setPosition(topPosition, bottomPosition, leftPosition, rightPosition);
      selection.outline.setSize(topSize, bottomSize, leftSize, rightSize);
    }
  }
}
