import React             from 'react';

let {Component} = React;

export default class SkillBubbles extends Component {

  componentDidMount() {
    var rootNode = document.querySelector('skill-bubbles');
    rootNode.innerHTML = '';
    let rawBubbles = this.props.list;
    draw_skills_bubbles(rawBubbles, rootNode);
  }
  render() {
    return ( <skill-bubbles/> );
  }

  shouldComponentUpdate( nextProps, nextState) {
      if(nextProps.hasOwnProperty('list')) {
        var rootNode = document.querySelector('skill-bubbles');
        rootNode.innerHTML = '';
        let rawBubbles = nextProps.list;
        draw_skills_bubbles(rawBubbles, rootNode);
      }
      return false;
  }

}