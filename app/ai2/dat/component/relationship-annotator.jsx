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


class RelationshipAnnotator extends Annotator {
  constructor(props) {
    super(props);
  }
  // handleAnnotationClick(annotation) {
  //   if (this.relationship.isRelated(annotation.id)) {
  //     if (this.relationship.source === annotation.id) {
  //       this.relationship.removeSourceId();
  //     } else {
  //       this.relationship.removeTargetId();
  //     }
  //     annotation.removeRelationship(this.relationship);
  //   } else {
  //     if (!this.relationship.source) {
  //       this.relationship.setSourceId(annotation.id);
  //     } else {
  //       this.relationship.setTargetId(annotation.id);
  //     }
  //     annotation.addRelationship(this.relationship);
  //   }
  // }

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

  handleArrowPointClick(annotation, arrowPoint, arrowPointType) {
    var removed;
    switch (arrowPointType) {
      case 'origin':
        if (this.relationship.arrowOrigin) {
          this.relationship.removeOriginId();
          if (this.relationship.arrowOrigin === arrowPoint.id) {
            annotation.removeRelationship(this.relationship);
          } else {
            removed = AnnotationManager.getAnnotation(
                this.props.imageId,
                this.relationship.arrowOrigin
                );
            removed.removeRelationship(this.relationship);
            this.relationship.setArrowOriginId(arrowPoint.id, arrowPoint.remoteId);
            annotation.addRelationship(this.relationship);
          }
        } else {
          this.relationship.setArrowOriginId(arrowPoint.id, arrowPoint.remoteId);
          annotation.addRelationship(this.relationship);
        }
        break;
      case 'destination':
        if (this.relationship.arrowDestination) {
          this.relationship.removeDestinationId();
          if (this.relationship.arrowDestination === arrowPoint.id) {
            annotation.removeRelationship(this.relationship);
          } else {
            removed = AnnotationManager.getAnnotation(
                this.props.imageId,
                this.relationship.arrowDestination
                );
            removed.removeRelationship(this.relationship);
            this.relationship.setArrowDestinationId(arrowPoint.id, arrowPoint.remoteId);
            annotation.addRelationship(this.relationship);
          }
        } else {
          this.relationship.setArrowDestinationId(arrowPoint.id, arrowPoint.remoteId);
          annotation.addRelationship(this.relationship);
        }
        break;
    }

  }

  handleClickEvent(event, annotation, arrowPoint, arrowPointType) {
    if(annotation instanceof QuestionAnnotation){
      annotation.category.push(AnnotationManager.getCurrentCategory());
      var gn = AnnotationManager.getCurrentGroupNumber();
      var cn = AnnotationManager.getCurrentClickNumber();
      var new_grouping = [gn, cn];
      annotation.group_n.push(new_grouping);
      AnnotationManager.advanceCurrentClickNumber();
      AnnotationManager.addAnnotation(this.props.imageId, annotation);
      AnnotationManager.setLastClicked(annotation);
    }
  }
  //   if (!this.relationship) {
  //     this.relationship = new RelationshipAnnotation(
  //         AnnotationManager.getNewAnnotationId(AnnotationType.RELATIONSHIP)
  //     );
  //   }
  //   if (annotation instanceof ShapeAnnotation || annotation instanceof TextAnnotation || annotation instanceof ContainerAnnotation ) {
  //     this.handleAnnotationClick(annotation);
  //   } else if (annotation instanceof ArrowAnnotation) {
  //     this.handleArrowPointClick(annotation, arrowPoint, arrowPointType);
  //   }
  //
  //   if(this.relationship.source && this.relationship.target) {
  //     AnnotationManager.addAnnotation(this.props.imageId, this.relationship);
  //     this.relationship = undefined;
  //   }
  // }

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
