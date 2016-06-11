module.exports =
  outlineWidth:
    title: 'Outline Width'
    description: 'The width of the outline in pixels.'
    type: 'integer'
    default: 1
  outlineStyle:
    title: 'Outline Style'
    description: 'The border style of the outline. (CSS border-style)'
    type: 'string'
    default: 'solid'
  outlineColor:
    title: 'Outline Color'
    description: 'The color of the outline.'
    type: 'color'
    default: '#C0C0C0'
  outlineOpacity:
    title: 'Outline Opacity'
    description: 'The opacity of the outline ranging from 0 to 1.'
    type: 'number'
    default: 1
    minimum: 0
    maximum: 1
