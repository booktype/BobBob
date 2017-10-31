import React from 'react';


export default [
    {
      name: "ENDNOTE",
      component: (props)=>{
        return (
          <sup className={"endnote"} data-entity={props.entityKey}></sup>
        )
      }
    },
    // {
    //   name: "LINK",
    //   component: (props) => {
    //     const {url} = props.contentState.getEntity(props.entityKey).getData();
    //     return (
    //       <a href={url}>
    //         {props.children}
    //       </a>
    //     );
    //   }
    // },
    {
      name: "QUOTE",
      component: (props) => {
        const {cite} = props.contentState.getEntity(props.entityKey).getData();
        return (
          <q cite={cite} >
            {props.children}
          </q>
        );
      }
    },
    {
      name: "TIME",
      component: (props) => {
        const {datetime} = props.contentState.getEntity(props.entityKey).getData();
        return (
          <time datetime={datetime}>
            {props.children}
          </time>
        );
      }
    },
    {
      name: "IMAGE",
      component: (props) => {
        const {href, src, width, height, alt, style} = props.contentState.getEntity(props.entityKey).getData()
        if(href){
          return (
           <a href={href}>
             <img src={src} width={width} height={height} alt={alt}/>
           </a>
          )
        }
        return (
          <img src={src} width={width} height={height} style={style} alt={alt}/>
        )
      }
    }
  ]
