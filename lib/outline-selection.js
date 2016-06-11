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
      let outlineSelectionView = new OutlineSelectionView();
      _updateOutlineStyle(outlineSelectionView);
      outlineSelectionView.attach(editorView);
      outlineSelectionView.hide();

      editor.onDidChangeSelectionRange(function(event) {
        _updateOutline(outlineSelectionView, event.selection.getScreenRange());
      });
      editorView.onDidChangeScrollTop(function() {
        _updateOutline(outlineSelectionView, editor.getSelectedBufferRange());
      });
      editorView.onDidChangeScrollLeft(function() {
        _updateOutline(outlineSelectionView, editor.getSelectedBufferRange());
      });
      atom.config.onDidChange('outline-selection', function() {
        _updateOutlineStyle(outlineSelectionView);
      });
    });
  },

  deactivate() {
    //this.outlineSelectionView.destroy();
  },

};

/**
 * Updates the CSS styling on the outline. Gets the values from the config.
 * @param  {OutlineSelectionView} outline The view class for the outline.
 */
function _updateOutlineStyle(outline) {
  let outlineWidth = atom.config.get('outline-selection.outlineWidth');
  let outlineStyle = atom.config.get('outline-selection.outlineStyle');
  let outlineColor = atom.config.get('outline-selection.outlineColor');
  let outlineOpacity = atom.config.get('outline-selection.outlineOpacity');

  outline.setStyle(`${outlineWidth}px ${outlineStyle} rgba(${outlineColor.red},${outlineColor.green},${outlineColor.blue},${outlineColor.alpha})`, outlineOpacity);
}

/**
 * Updates the size and position of the outline. Hides the outline when no
 * seleciton exists.
 * @param  {OutlineSelectionView} outline The view class for the outline.
 * @param  {Range} selectionRange         The range of the most recent selection
 *                                        that will be outlined.
 */
function _updateOutline(outline, selectionRange) {
  if (selectionRange.start.row == selectionRange.end.row && selectionRange.start.column == selectionRange.end.column) {
    // hide when there is no selection
    outline.hide();
  } else {
    // show and reposition when there is a selection
    outline.show();

    let editorView = outline.getView();
    let pixelRect = editorView.pixelRectForScreenRange(selectionRange);
    let lineHeight = editorView.getModel().getLineHeightInPixels();
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
    outline.setPosition(topPosition, bottomPosition, leftPosition, rightPosition);

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
    outline.setSize(topSize, bottomSize, leftSize, rightSize);
  }
}
