/**
 * Data Controller
 */
var DataController = (function() {
  var MemoryItem = function(id, details, name) {
    this.id = id;
    this.details = details;
    this.name = name;
  };

  var data = {
    allItems: [],
    count: 0
  };

  return {
    addItem: function(item) {
      var newItem, id;

      if (data.allItems.length > 0) {
        id = data.allItems[data.allItems.length - 1].id + 1;
      } else {
        id = 0;
      }

      newItem = new MemoryItem(id, item.details, item.name);
      data.allItems.push(newItem);
      data.count += 1;
      return newItem;
    },

    deleteItem: function(id) {
      var idArr, idx;

      data.count -= 1;

      idArr = data.allItems.map(function(current, index, array) {
        return current.id;
      });

      idx = idArr.indexOf(id);
      if (idx !== -1) {
        data.allItems.splice(idx, 1);
      }
    },

    getMemoryCount: function() {
      return data.count;
    },

    dumpData: function() {
      console.log(data);
    }
  };
})();

/**
 * UI Controller
 */
var UIController = (function() {
  var DOMStrings = {
    memoryButton: ".memory__add",
    memoryDetails: ".memory__details",
    memoryList: ".memories",
    memoryName: ".memory__name",
    memoryCount: ".memory__count",
    memoryDelete: ".memory__delete",
    container: ".container"
  };

  return {
    getDOMStrings: function() {
      return DOMStrings;
    },

    getInput: function() {
      return {
        details: document.querySelector(DOMStrings.memoryDetails).value,
        name: document.querySelector(DOMStrings.memoryName).value
      };
    },

    clearFields: function() {
      var fields;
      fields = document.querySelectorAll(
        `${DOMStrings.memoryDetails}, ${DOMStrings.memoryName}`
      );

      // Convert NodeList to Array
      // In ES6, you can do Array.from(fields).
      fields = Array.prototype.slice.call(fields);
      fields.forEach(function(current, index, arr) {
        current.value = "";
      });

      fields[0].focus();
    },

    addMemoryItem: function(memory) {
      var memoryList, html;

      memoryList = document.querySelector(DOMStrings.memoryList);
      html = `
      <div class="memory__item" id="memory-id-${memory.id}">
        <p class="memory__contents">
          ${memory.details} 
          <span class="memory__sign"> -- ${memory.name}</span> 
          <a class="memory__delete"><i class="icon ion-md-close-circle-outline"></i></a>
        </p>
      </div>`;

      memoryList.insertAdjacentHTML("beforeend", html);
    },

    updateMemoryCount: function(count) {
      var domCount;

      domCount = document.querySelector(DOMStrings.memoryCount);
      domCount.textContent = count;
    },

    deleteMemoryItem: function(itemId) {
      var el = document.getElementById(itemId);

      el.parentNode.removeChild(el);
    }
  };
})();

/**
 * Main App Controller
 */
var AppController = (function(UICtrl, DataCtrl) {
  function addItem() {
    //1. get input from fields
    var input, memoryItem;

    input = UICtrl.getInput();

    if (input.details !== "" && input.name !== "") {
      memoryItem = DataCtrl.addItem(input);

      //2. clear the fields
      UICtrl.clearFields();

      //3. update the UI (by adding DOM)
      UICtrl.addMemoryItem(memoryItem);
      UICtrl.updateMemoryCount(DataCtrl.getMemoryCount());
    }
  }

  function deleteItem(event) {
    // 1. get element id
    var itemId, id, splits;
    itemId = event.target.parentNode.parentNode.parentNode.id;

    if (itemId) {
      splits = itemId.split("-");
      id = parseInt(splits[2]);

      // 2. delete item from data structure
      DataCtrl.deleteItem(id);

      // 3. delete item from UI
      UICtrl.deleteMemoryItem(itemId);

      // 4. update count
      UICtrl.updateMemoryCount(DataCtrl.getMemoryCount());
    }
  }

  function setupEventListeners() {
    var DOMStrings = UICtrl.getDOMStrings();

    document
      .querySelector(DOMStrings.memoryButton)
      .addEventListener("click", addItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });

    document
      .querySelector(DOMStrings.memoryList)
      .addEventListener("click", deleteItem);
  }

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(UIController, DataController);

AppController.init();
