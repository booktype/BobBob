import ApiInterface from './interface';


/* eslint-disable */

class Dummy extends ApiInterface {

  getCurrentUser = () => {
    return {
      "id": 1,
      "username": "admin",
      "email": "oleg.pshenichniy@sourcefabric.org",
      "first_name": "Oleg Pshenichniy",
      "last_name": "",
      "is_active": true,
      "is_superuser": true,
      "profile_url": "/accounts/admin/",
      "profile_image_url": "/data/profile_images/admin.jpg",
      "get_full_name": "Oleg Pshenichniy"
    };
  };

  getUsers = () => {

    return [
      {
        "id": 3,
        "username": "loca",
        "email": "oleg.pshenichniy@sourcefabric.org",
        "first_name": "Oleg Pshenichniy",
        "last_name": "",
        "is_active": true,
        "is_superuser": true,
        "profile_url": "/accounts/admin/",
        "profile_image_url": "/data/profile_images/admin.jpg",
        "get_full_name": "Oleg Pshenichniy",
        "permissions": [
          {
            "id": 29,
            "app_name": "edit",
            "name": "rename_section",
            "description": "Rename section"
          }
        ]
      }, {
        "id": 2,
        "username": "vasilis",
        "email": "oleg.pshenichniy@sourcefabric.org",
        "first_name": "Vasilis Kef",
        "last_name": "",
        "is_active": true,
        "is_superuser": true,
        "profile_url": "/accounts/vasilis/",
        "profile_image_url": "/data/profile_images/vasilis.jpg",
        "permissions": [
          {
            "id": 29,
            "app_name": "edit",
            "name": "rename_section",
            "description": "Rename section"
          }
        ]
      }
    ];
  };

  getContent = () => {

    return new Promise((resolve, reject) => {

      resolve(
        {
          "entityMap": {},
          "blocks": [
            {
              "key": "ctvc0",
              "text": "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur aliquet quam id dui posuere blandit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Proin eget tortor risus. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
              "type": "unstyled",
              "depth": 0,
              "inlineStyleRanges": [],
              "entityRanges": [],
              "data": {}
            },
            {
              "key": "akoh2",
              "text": "Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
              "type": "unstyled",
              "depth": 0,
              "inlineStyleRanges": [
                {
                  "offset": 0,
                  "length": 517,
                  "style": "BOLD",
                  "key": ""
                }
              ],
              "entityRanges": [],
              "data": {}
            },
            {
              "key": "brfhq",
              "text": "Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
              "type": "unstyled",
              "depth": 0,
              "inlineStyleRanges": [
                {
                  "offset": 0,
                  "length": 1034,
                  "style": "ITALIC",
                  "key": ""
                },
                {
                  "offset": 0,
                  "length": 1034,
                  "style": "backgroundColor__#ffffff",
                  "key": ""
                },
                {
                  "offset": 0,
                  "length": 1034,
                  "style": "color__#d0021b",
                  "key": ""
                }
              ],
              "entityRanges": [],
              "data": {}
            },
            {
              "key": "ft50e",
              "text": "Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
              "type": "h4",
              "depth": 0,
              "inlineStyleRanges": [],
              "entityRanges": [],
              "data": {}
            },
            {
              "key": "22ccp",
              "text": "Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
              "type": "unstyled",
              "depth": 0,
              "inlineStyleRanges": [
                {
                  "offset": 0,
                  "length": 1034,
                  "style": "UNDERLINE",
                  "key": ""
                }
              ],
              "entityRanges": [],
              "data": {}
            },
            {
              "key": "94vuo",
              "text": "Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
              "type": "blockquote",
              "depth": 0,
              "inlineStyleRanges": [],
              "entityRanges": [],
              "data": {}
            },
            {
              "key": "7s296",
              "text": "Donec sollicitudin molestie malesuada. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
              "type": "unstyled",
              "depth": 0,
              "inlineStyleRanges": [],
              "entityRanges": [],
              "data": {}
            }
          ],
          "metaMap": {}
        }
      );
    });
  };

  saveContent = () => {
    return true;
    throw 'Not Implemented Error';

  };

  getImages = () => {
    return [
      {
        url: '',
        title: ''
      }
    ];
    throw 'Not Implemented Error';
  };

  uploadImage = () => {
    return {
      url: '',
      title: ''
    };
    throw 'Not Implemented Error';
  };

  getThemes = () => {
    return [
      {
        name: '',
        url: '',

      }
    ];
  };

  getFonts = () => {
    return [
      {
        name: '',
        url: ''
      }
    ];
  };

  getComments = () => {
    return [
      {
        text: '',
        id: '',

      }
    ];
  };

  addComment = (content, text) => {
    throw 'Not Implemented Error';
  };

  replyComment = (content, comment_id) => {
    return 'new_comment_id';
  };

  resolveComment = (comment_id) => {
    return true;
    throw 'Not Implemented Error';
  };

  deleteComment = (comment_id) => {
    return true;
    throw 'Not Implemented Error';
  };
}


export default Dummy;
