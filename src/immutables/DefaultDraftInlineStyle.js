export default {
  DEFAULT: {
    tag: "span",
    style: {}
  },
  BREAK: {
    tag: "br",
    style: {},
    void: true
  },
  BOLD: {
    tag: "b",
    style: {
      fontWeight: 'bold',
    }
  },
  LINK: {
    tag: "a",
    style: {}
  },
  COMMENT: {
    tag: "span",
    style: {
      backgroundColor: 'lightgoldenrodyellow'
    }
  },
  CODE: {
    tag: "code",
    style: {
      fontFamily: 'monospace',
      wordWrap: 'break-word',
    }
  },
  TELETYPE: {
    tag: "tt",
    style: {}
  },
  EMPHASIS: {
    tag: "em",
    style: {}
  },
  STRONG: {
    tag: "strong",
    style: {}
  },
  SAMP: {
    tag: "samp",
    style: {}
  },
  VAR: {
    tag: "var",
    style: {}
  },
  QUOTATION: {
    tag: "q",
    style: {}
  },
  SUB: {
    tag: "sub",
    style: {}
  },
  SUP: {
    tag: "sup",
    style: {}
  },
  BDO: {
    RTL: {
      tag: "bdo",
      attributes: {
        dir: "rtl"
      },
      style: {}
    },
    LTR: {
      tag: "bdo",
      attributes: {
        dir: "ltr"
      },
      style: {}
    }
  },
  ITALIC: {
    tag: "i",
    style: {
      fontStyle: 'italic',
    }
  },

  STRIKETHROUGH: {
    tag: "strike",
    style: {
      textDecoration: 'line-through',
    }
  },
  UNDERLINE: {
    tag: "u",
    style: {
      textDecoration: 'underline',
    }
  },
};
