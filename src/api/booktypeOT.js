class OT {
  constructor({wsUrl, bookID, documentID, userID}) {
    this.bookID = bookID;
    this.documentID = documentID;
    this.wsUrl = wsUrl;
    this.userID = userID;
    this.connectWS();
  }

  connectWS = () => {
    this.server = new WebSocket(this.wsUrl);
    this.server.onopen = () => {
      this.publish('init', {bookID: this.bookID, documentID: this.documentID, userID: this.userID});
    };
    this.server.onclose = () => {
      setTimeout(
        () => {
          this.connectWS();
        }, 3000
      );
    };
    this.server.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.documentID === this.documentID) {
        this.subscribe(data);
      }
    };
  };

  updateDocumentID(documentID) {
    this.documentID = documentID;
    this.publish('init', {bookID: this.bookID, documentID: this.documentID, userID: this.userID});
  }

  publish(action, args) {
    this.server.send(JSON.stringify({action, args, documentID: this.documentID}));
  }

  otChange = (change) => {
    this.publish('otChange', change);
  };

  subscribe() {
  }

}


export default OT;