'use strict';

var Annotation = require('./annotation');
var AnnotationType = require('./annotation-type');
var TextAnnotation = require('./text-annotation')

class QuestionAnnotation extends TextAnnotation {
  constructor(id, bounds, category, group_n) {
    super(id, bounds, '', category);
    this.group_n = group_n;
  }
}

module.exports = QuestionAnnotation;
