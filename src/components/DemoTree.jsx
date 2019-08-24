import React from 'react';
// import ReactDOM from 'react-dom';
// import Radium from 'radium';
import {Treebeard, decorators} from 'react-treebeard';

const styles = {
  tree: {
      base: {
          listStyle: 'none',
          backgroundColor: 'green',
          margin: 0,
          padding: 0,
          color: '#9DA5AB',
          fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
          fontSize: '14px'
      },
      node: {
          base: {
              position: 'relative'
          },
          link: {
              cursor: 'pointer',
              position: 'relative',
              padding: '0px 5px',
              display: 'block'
          },
          activeLink: {
              background: '#31363F'
          },
          toggle: {
              base: {
                  position: 'relative',
                  display: 'inline-block',
                  verticalAlign: 'top',
                  marginLeft: '-5px',
                  height: '24px',
                  width: '24px'
              },
              wrapper: {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  margin: '-7px 0 0 -7px',
                  height: '14px'
              },
              height: 14,
              width: 14,
              arrow: {
                  fill: '#9DA5AB',
                  strokeWidth: 0
              }
          },
          header: {
              base: {
                  display: 'inline-block',
                  verticalAlign: 'top',
                  color: '#9DA5AB'
              },
              connector: {
                  width: '2px',
                  height: '12px',
                  borderLeft: 'solid 2px black',
                  borderBottom: 'solid 2px black',
                  position: 'absolute',
                  top: '0px',
                  left: '-21px'
              },
              title: {
                  lineHeight: '24px',
                  verticalAlign: 'middle'
              }
          },
          subtree: {
              listStyle: 'none',
              paddingLeft: '29px'
          },
          loading: {
              color: '#E2C089'
          }
      }
  }
};


const data = {
  name: 'react-treebeard',
  id: 1,
  toggled: true,
  children: [
      {
          name: 'example',
          children: [
              { name: 'app.js' },
              { name: 'data.js' },
              { name: 'index.html' },
              { name: 'styles.js' },
              { name: 'webpack.config.js' }
          ]
      },
      {
          name: 'node_modules',
          loading: true,
          children: []
      },
      {
          name: 'src',
          children: [
              {
                  name: 'components',
                  children: [
                      { name: 'decorators.js' },
                      { name: 'treebeard.js' }
                  ]
              },
              { name: 'index.js' }
          ]
      },
      {
          name: 'themes',
          children: [
              { name: 'animations.js' },
              { name: 'default.js' }
          ]
      },
      { name: 'gulpfile.js' },
      { name: 'index.js' },
      { name: 'package.json' }
  ]
};

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

// Helper functions for filtering
var defaultMatcher = (filterText, node) => {
    return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
};

var nodeMatchesOrHasMatchingDescendants = (node, filter, matcher) => {
    return matcher(filter, node) || // i match
        (node.children && // or i have decendents and one of them match
        node.children.length &&
        !!node.children.find(childNode => nodeMatchesOrHasMatchingDescendants(childNode, filter, matcher)));
};

var filterTree = (node, filter, matcher = defaultMatcher) => {
    if(matcher(filter, node)){ // if im an exact match then all my children get to stay
        return node;
    }
    // if not then only keep the ones that match or have matching descendants
    var filteredChildren;

    if(node.children) {
        filteredChildren = node.children.filter(child => nodeMatchesOrHasMatchingDescendants(child, filter, matcher));
    }

    if(filteredChildren && filteredChildren.length){
        filteredChildren = filteredChildren.map(child => filterTree(child, filter, matcher));
    }

    return Object.assign({}, node, {
        children: filteredChildren
    });
};

var expandNodesWithMatchingDescendants = (node, filter, matcher = defaultMatcher) => {
    var children = node.children;
    var shouldExpand = false;

    if(children && children.length){
        var childrenWithMatches = node.children.filter(child => nodeMatchesOrHasMatchingDescendants(child, filter, matcher));
        shouldExpand = !!childrenWithMatches.length; // I expand if any of my kids match

        if(shouldExpand) {// if im going to expand
            // go through all the matches and see if thier children need to expand
            children = childrenWithMatches.map(child => expandNodesWithMatchingDescendants(child, filter, matcher));
        }
    }

    return Object.assign({}, node, {children: children, toggled: shouldExpand});
};
// end of helper functions

// Example: Customising The Header Decorator To Include Icons
decorators.Header = (props) => {
    const style = props.style;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };
    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                {props.node.name}
            </div>
        </div>
    );
};

class NodeViewer extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const style = styles.viewer;
        let json = JSON.stringify(this.props.node, null, 4);
        if(!json){ json = HELP_MSG; }
        return (
            <div>
                {json}
            </div>
        );
    }
}

class DemoTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }
    onFilterMouseUp(e){
        const filter = e.target.value.trim();

        if(filter){
            var filtered = filterTree(data, filter);
            filtered = expandNodesWithMatchingDescendants(filtered, filter);

            this.setState({data: filtered});
        }
        else {
            this.setState({data});
        }
    }

    render(){
        return (
            <div>
                <input onKeyUp={this.onFilterMouseUp.bind(this)} />
                <div style={styles.component}>
                    <Treebeard
                        data={this.state.data}
                        onToggle={this.onToggle}
                        decorators={decorators}
                    />
                </div>
                <div style={styles.component}>
                    <NodeViewer node={this.state.cursor}/>
                </div>
            </div>

        );
    }
}

export default DemoTree;
