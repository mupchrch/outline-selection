'use babel';

import OutlineSelectionView from './outline-selection-view';
import configSchema from './config-schema';
//import { CompositeDisposable } from 'atom';

let outlineWidth = 0;
let outlineRadius = 0;
// save previous width in case pixelRectForScreenRange width is zero
let prevSelectionWidth = 0;
let isUpdatingOutline = false;

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
        _updateOutline(selection);
      });
      editor.onDidChangeSelectionRange(function(event) {
        event.selection.outline.attach(editorView); // reattach in case DOM refreshed #9
        _updateOutline(event.selection);
      });
      editorView.onDidChangeScrollTop(function() {
        let selections = editor.getSelections();
        for(let selection of selections) {
          selection.outline.attach(editorView); // reattach in case DOM refreshed #9
          _updateOutline(selection);
        }
      });
      editorView.onDidChangeScrollLeft(function() {
        let selections = editor.getSelections();
        for(let selection of selections) {
          selection.outline.attach(editorView); // reattach in case DOM refreshed #9
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
        if(selection.outline) {
          selection.outline.destroy();
          selection.outline = null;
        }
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
  outlineRadius = atom.config.get('outline-selection.outlineRadius');

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
  if(isUpdatingOutline) { // don't call this function if it is already executing #6
    return;
  }
  isUpdatingOutline = true;

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
    let lineHeight = selection.editor.getLineHeightInPixels();
    let editorScroll = {
      top: editorView.getScrollTop(),
      bottom: editorView.getScrollBottom(),
      left: editorView.getScrollLeft(),
      right: editorView.getScrollRight(),
      width: editorView.getScrollWidth(),
    }
    let selectionStartPosition = editorView.pixelPositionForScreenPosition(selectionRange.start);
    let selectionEndPosition = editorView.pixelPositionForScreenPosition(selectionRange.end);

    if(selectionRange.start.row == selectionRange.end.row) { // single line selection
      // CALCULATE POSITION
      let topPosition = {
        top: (selectionStartPosition.top - editorScroll.top) - outlineWidth,
        left: (selectionStartPosition.left - editorScroll.left) - outlineWidth,
      };
      let bottomPosition = {
        top: selectionStartPosition.top - editorScroll.top,
        left: selectionStartPosition.left - editorScroll.left,
      };
      let leftPosition = {
        top: (selectionStartPosition.top - editorScroll.top) + lineHeight,
        left: selectionStartPosition.left - outlineWidth,
      };
      let rightPosition = {
        top: (selectionStartPosition.top - editorScroll.top) - outlineWidth,
        left: selectionEndPosition.left - editorScroll.left,
      };

      // CALCULATE SIZE
      let topSize = {
        width: (selectionEndPosition.left - selectionStartPosition.left) + outlineWidth,
        height: lineHeight + outlineWidth,
      };
      let bottomSize = {
        width: selectionEndPosition.left - selectionStartPosition.left,
        height: lineHeight,
      };
      let leftSize = {
        width: 0,
        height: lineHeight,
      };
      let rightSize = {
        width: 0,
        height: lineHeight,
      };

      // FIX SPECIFIC SCENARIO
      if(selectionStartPosition.left == 0) { // selection from start of line
        topPosition.left = selectionStartPosition.left - editorScroll.left;
        topSize.width = selectionEndPosition.left - selectionStartPosition.left;
      }

      // SET POSITION AND SIZE
      selection.outline.setPosition(topPosition, bottomPosition, leftPosition, rightPosition);
      selection.outline.setSize(topSize, bottomSize, leftSize, rightSize);
      selection.outline.setRadius(outlineRadius, true);
      selection.outline.hideSides();
    } else if (selectionRange.start.row != selectionRange.end.row) { // multi line selection
      // CALCULATE POSITION
      let topPosition = {
        top: (selectionStartPosition.top - editorScroll.top) - outlineWidth,
        left: (selectionStartPosition.left - editorScroll.left) - outlineWidth,
        right: (editorScroll.right - editorScroll.width) + outlineWidth,
      };
      let bottomPosition = {
        top: selectionEndPosition.top - editorScroll.top,
        left: 0 - editorScroll.left,
      };
      let leftPosition = {
        top: ((selectionStartPosition.top - editorScroll.top) + lineHeight) - outlineWidth,
        left: 0 - editorScroll.left,
      };
      let rightPosition = {
        top: selectionStartPosition.top - editorScroll.top,
        left: (selectionEndPosition.left - editorScroll.left) - outlineWidth,
        right: (editorScroll.right - editorScroll.width) + outlineWidth,
      };

      // CALCULATE SIZE
      let topSize = {
        height: lineHeight,
      };
      let bottomSize = {
        width: selectionEndPosition.left,
        height: lineHeight,
      };
      let leftSize = {
        width: Math.max(0, selectionStartPosition.left),
        height: selectionEndPosition.top - selectionStartPosition.top,
      };
      let rightSize = {
        height: selectionEndPosition.top - selectionStartPosition.top,
      };

      // FIX SPECIFIC SCENARIOS
      if(selectionStartPosition.left == 0) { // selection from start of line
        topPosition.left = 0 - editorScroll.left;
      } else if(selectionRange.end.row - selectionRange.start.row == 1
                && selectionStartPosition.left > selectionEndPosition.left) { // disconnected selection
        rightPosition.left = selectionStartPosition.left - editorScroll.left;
        topSize.height = lineHeight + outlineWidth;
        leftSize.width = selectionEndPosition.left;
      }

      // SET POSITION AND SIZE
      selection.outline.setPosition(topPosition, bottomPosition, leftPosition, rightPosition);
      selection.outline.setSize(topSize, bottomSize, leftSize, rightSize);
      selection.outline.setRadius(outlineRadius, false);
    }
  }
  isUpdatingOutline = false;
}
