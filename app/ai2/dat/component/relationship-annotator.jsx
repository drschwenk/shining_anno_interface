'use strict';

const React = require('react');
const AnnotationClickManager = require('../model/annotation-click-manager');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationType = require('../model/annotation-type');
const ShapeAnnotation = require('../model/shape-annotation');
const ContainerAnnotation = require('../model/container-annotation');
const TextAnnotation = require('../model/text-annotation');
const QuestionAnnotation = require('../model/question-annotation');
const RelationshipAnnotation = require('../model/relationship-annotation');
const ArrowAnnotation = require('../model/arrow-annotation');
const Annotator = require('./annotator.jsx');
const Radium = require('radium');
const AnnotationManagerEvent = require('../model/annotation-manager-event');
const RelationshipRestriction = require('../model/relationship-restrictions');
const MessageManager = require('../util/message-manager');

class RelationshipAnnotator extends Annotator {
  constructor(props) {
    super(props);
  }
  handleAnnotationClick(annotation) {
    if (this.relationship.isRelated(annotation.id)) {
      if (this.relationship.source === annotation.id) {
        this.relationship.removeSourceId();
      } else {
        this.relationship.removeTargetId();
      }
      annotation.removeRelationship(this.relationship);
    } else {
      if (!this.relationship.source) {
        this.relationship.setSourceId(annotation.id);
      } else {
        this.relationship.setTargetId(annotation.id);
      }
      annotation.addRelationship(this.relationship);
    }
  }
  handleClickEvent(event, annotation, arrowPoint, arrowPointType) {
    var cur_cat = AnnotationManager.getCurrentCategory();
    if(AnnotationManager.getCurrentClickNumber() <= RelationshipRestriction[cur_cat]){
      annotation.category.push(cur_cat);
      var gn = AnnotationManager.getCurrentGroupNumber();
      var cn = AnnotationManager.getCurrentClickNumber();
      var new_grouping = [gn, cn];
      annotation.group_n.push(new_grouping);
      AnnotationManager.advanceCurrentClickNumber();
      AnnotationManager.emit(AnnotationManagerEvent.MODE_CHANGED);
      AnnotationManager.setLastClicked(annotation);
    }
    else{
      MessageManager.warn("Reached the max number of constituents for " +cur_cat);
    }
  }
  componentDidMount() {
    super.componentDidMount();
    AnnotationClickManager.activate().clicked(this.handleClickEvent.bind(this));
  }

  cancel() {
    AnnotationManager.removeRelationships(this.props.imageId, this.relationship);
    this.relationship = undefined;
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    AnnotationClickManager.deactivate();
    // Remove a pending relationship
    if (this.relationship) {
      AnnotationManager.removeRelationships(this.props.imageId, this.relationship);
      this.relationship.removeAllListeners();
      this.relationship = undefined;
    }
  }

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: Math.round(srcWidth*ratio), height: Math.round(srcHeight*ratio)};
   }

  render() {
    var tool_body = window.document.getElementsByTagName('main')[0];
    var body_height = tool_body.clientHeight;
    var body_width = tool_body.clientWidth;

    var cat_picker_width;
    var div_elems = window.document.getElementsByTagName('div');
    for(var i = 0; i < div_elems.length; i++){
      if(div_elems[i].className == 'diagram-annotation-tool'){
        var anno_main = div_elems[i].getElementsByTagName('main')[0];
        var anno_elem = anno_main.getElementsByTagName('div');
        for(var i = 0; i < anno_elem.length; i++){
          if(anno_elem[i].className == 'annotation-pane-dialog-header'){
            var pane_elem = anno_elem[i];
            var cat_picker_width = pane_elem.clientWidth;
          }
        }
      }
    }
  var anno_pane_width = body_width - cat_picker_width;
  var new_dims= this.calculateAspectRatioFit(this.props.h_dim, this.props.v_dim,
    anno_pane_width, body_height);
    AnnotationManager.new_dims = new_dims;
  var cssClass = 'annotation-pane relationship-annotation-pane';
  var style = {
    border: '8px dotted @blue'
  }
  return (
      <div className={cssClass}
        style={style}>
        <div className="annotation-pane-image" ref="origin">
          <img src={this.props.imageUrl} style={{height: new_dims.height, width: new_dims.width}}/>

          {this.props.annotations}
        </div>
      </div>
    );
  }
}

module.exports = RelationshipAnnotator;
