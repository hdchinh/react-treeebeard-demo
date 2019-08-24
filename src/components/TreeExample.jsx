import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import { Treebeard } from 'react-treebeard';

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

const vang = {
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

const animations = {
  toggle: ({node: {toggled}}, duration = 300) => ({
      animation: {rotateZ: toggled ? 90 : 0},
      duration: duration
  }),
  drawer: (/* props */) => ({
      enter: {
          animation: 'slideDown',
          duration: 300
      },
      leave: {
          animation: 'slideUp',
          duration: 300
      }
  })
};

class TreeExample extends PureComponent {
    constructor(props){
        super(props);
        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
    }
    
    onToggle(node, toggled){
        const {cursor, data} = this.state;
        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }
        node.active = true;
        if (node.children) { 
            node.toggled = toggled; 
        }
        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    render(){
        const {data} = this.state;
        const tmp = {
          width: '400px'
        }
        return (
          <div style={tmp}>
            <Treebeard
              data={data}
              onToggle={this.onToggle}
              style={vang}
              animations={animations}
              toggled={false}
              active={false}
            />
          </div>
        );
    }
}

export default TreeExample;
