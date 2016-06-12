'use babel';

import OutlineSelectionView from './outline-selection-view';
import configSchema from './config-schema';
//import { CompositeDisposable } from 'atom';

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

  let outlineWidth = atom.config.get('outline-selection.outlineWidth');
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
    let lineHeight = selection.editor.getLineHeightInPixels();
    let editorScrollTop = editorView.getScrollTop();
    let editorScrollLeft = editorView.getScrollLeft();
    let selectionStartLeft = editorView.pixelPositionForScreenPosition(selectionRange.start).left;
    let selectionEndLeft = editorView.pixelPositionForScreenPosition(selectionRange.end).left;
    let isDisconnectedSelection = (selectionRange.end.row - selectionRange.start.row == 1 && selectionStartLeft > selectionEndLeft);

    // SET POSITION
    let topPosition = {
      top: pixelRect.top - editorScrollTop,
      left: selectionStartLeft - editorScrollLeft,
    };
    let bottomPosition = {
      top: ((pixelRect.top - editorScrollTop) + pixelRect.height) - lineHeight,
      left: pixelRect.left - editorScrollLeft,
    };
    let leftPosition = {
      top: (pixelRect.top - editorScrollTop) + lineHeight,
      left: pixelRect.left - editorScrollLeft,
    };
    let rightPosition = {
      top: pixelRect.top - editorScrollTop,
      left: selectionEndLeft - editorScrollLeft,
    };
    if (isDisconnectedSelection) {
      rightPosition.left = selectionStartLeft - editorScrollLeft;
    }
    selection.outline.setPosition(topPosition, bottomPosition, leftPosition, rightPosition);

    // SET SIZE
    let topSize = {
      width: pixelRect.width,
      height: lineHeight,
    };
    if (selectionRange.start.row != selectionRange.end.row) {
      topSize.width = pixelRect.width - selectionStartLeft;
    }
    let bottomSize = {
      width: selectionEndLeft - pixelRect.left,
      height: lineHeight,
    };
    let leftSize = {
      width: selectionStartLeft - pixelRect.left,
      height: pixelRect.height - lineHeight,
    };
    if (isDisconnectedSelection) {
      leftSize.width = selectionEndLeft - pixelRect.left;
    }
    let rightSize = {
      width: pixelRect.width - selectionEndLeft,
      height: pixelRect.height - lineHeight,
    };
    if (pixelRect.width - selectionEndLeft < 0) {
      rightSize.width = 0;
    } else if (isDisconnectedSelection) {
      rightSize.width = pixelRect.width - selectionStartLeft;
    }
    selection.outline.setSize(topSize, bottomSize, leftSize, rightSize);
  }
}
