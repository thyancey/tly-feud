let _callbacks = [];
let _initialized = false;

const _keyMap = {
  'BracketLeft': {
    action: 'selectLeftTeam'
  },
  'BracketRight': {
    action: 'selectRightTeam'
  },
  'Comma': {
    action: 'strike'
  },
  'Period': {
    action: 'startTimer'
  },
  'Quote': {
    action: 'awardPoints'
  },
  'Semicolon': {
    action: 'nextRound'
  },
  'KeyM': {
    action: 'playMusic'
  }
}

const InputManager = {
  addListeners: (commands, callback) => {
    commands.forEach(c => {
      InputManager.addListener(c, callback);
    })
  },
  removeListeners: (commands, callback) => {
    commands.forEach(c => {
      InputManager.removeListener(c, callback);
    })
  },

  addListener: (command, callback) => {
    if(!_initialized){
      _initialized = true;
      document.addEventListener('keydown', InputManager.onKeyDown.bind(this));
    }

    const found = _callbacks.find(cb => cb.command === command && cb.callback === callback);
    if(found){
      console.error('listener already added for ', found )
    }else{
      _callbacks.push({
        command: command,
        callback: callback
      }); 
    }
  },

  removeListener: (command, callback) => {
    const found = _callbacks.find(cb => cb.command === command && cb.callback === callback);
    if(found){
      _callbacks = _callbacks.filter(cb => cb !== found);
    }else{
      console.error('callback not found! for', command);
    }
  },

  onKeyDown: e => { 
    // console.log('key:', e.code);
    const command = _keyMap[e.code];
    if(command){
      const callbacks = _callbacks.filter(cb => cb.command === command.action);
      callbacks.forEach(cb => {
        cb.callback(command || null);
      });
    }
    return;
  }
}

Object.freeze(InputManager);
export default InputManager;