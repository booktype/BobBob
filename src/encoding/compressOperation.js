const compressionSchema = {
  String: (string)=>{
    return string
  },
  SelectionState: (selection)=>{
    return [
      selection.getAnchorKey(),
      selection.getAnchorOffset(),
      selection.getFocusKey(),
      selection.getFocusOffset(),
      selection.getIsBackward()
    ]
  },
  ContentBlock: (block)=>{
    return [
      block.getType(),
      block.getDepth(),
      block.getCharacterList().map((character)=>{
        return this.CharacterMetadata(character)
      }),
      block.getText(),
      block.getData().toJSON()
    ]
  },
  CharacterMetadata: (character)=>{
    return [
      character.getEntity(),
      character.getStyle().toJSON()
    ]
  },
  DraftEntityInstance: (entity) => {
    return [
      entity.getType(),
      entity.getMutability(),
      entity.getData().toJSON()
    ]
  },
  OrderedSet: (set) => {
    return set.toJSON()
  },
  OrderedMap: (orderedMap)=>{
    var array = []
    orderedMap.forEach((map)=>{
      array.push(
        this[map.constructor.name](map)
      )
    })
    return array
  }

  Number: (number)=>{
    return number
  },
  Map: (map)=>{
    return map.toJSON()
  }

}


function compress(contentHash, operationName, operationArgs){
  
}
