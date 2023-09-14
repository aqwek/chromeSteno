console.log("Content script is running.");

// Initialize the stenoStroke and formattedStrokes variables
let stenoStroke = null;
let formattedStrokes = '';
let currentKey = ''; // Custom variable to store the current key
let translationEnabled = true; // Variable to track translation status, initially enabled

// Function to toggle translation on/off
function toggleTranslation() {
  translationEnabled = !translationEnabled;
  console.log(`Translation is ${translationEnabled ? 'enabled' : 'disabled'}.`);
}

// Function to reset the custom variable currentKey
function resetCurrentKey() {
  currentKey = '';
}

// Your existing code for capturing keystrokes and translating to stenographic strokes
document.addEventListener('keydown', function (event) {
  // Check if translation is enabled
  if (!translationEnabled) {
    return; // Don't process keystrokes if translation is disabled
  }

  // Capture the key pressed by the user
  let currentKey = event.key;
  // Translate the key into stenographic strokes
  const newStenoStroke = translateToSteno(currentKey);

  // Check if the key has a stenographic stroke translation
  if (newStenoStroke !== null) {
    // Reset stenoBuffer and formattedStrokes on each key press
    stenoBuffer = [];
    formattedStrokes = '';

    // Add the stenographic stroke to a buffer
    addToStenoBuffer(newStenoStroke);
  }
});

// Function to reset formattedStrokes
function resetFormattedStrokes() {
  formattedStrokes = '';
  console.log('Resetting formattedStrokes...')
}

function translateToSteno(currentKey) {
  // Translate the key to its corresponding stenographic stroke
  return keyToSteno[currentKey] || null;
}

async function addToStenoBuffer(stenoStroke) {
  // Add the stenographic stroke to the buffer
  stenoBuffer.push(stenoStroke);

  // Format and translate the steno buffer
  formattedStrokes = formatStenoBuffer(stenoBuffer);

  // Look up the formatted strokes in the main.json dictionary
  translateWithMainJSON(formattedStrokes);
}

// Initialize a buffer to store stenographic strokes
let stenoBuffer = [];

function formatStenoBuffer(stenoBuffer) {
  // Implement your formatting logic here
  // You can reorder, join, or modify the steno strokes as needed
  // Example logic: Sort the strokes in steno order and handle missing asterisks
  const sortedStrokes = stenoBuffer.sort((a, b) => stenoOrder.indexOf(a) - stenoOrder.indexOf(b));
  return sortedStrokes.join('');
}

async function fetchMainJSON() {
  try {
    // Fetch the main.json file from your GitHub page
    const response = await fetch('https://raw.githubusercontent.com/aqwek/steno-dictionary/main/plover/main.json');
    if (response.ok) {
      const mainJSON = await response.json();
      console.log('Fetched main.json from GitHub.');
      return mainJSON;
    } else {
      console.error('Failed to fetch main.json from GitHub.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching main.json:', error);
    return null;
  }
}

// Define a mapping of keys to stenographic strokes based on your layout
const keyToSteno = {
  'q': 'S',
  'w': 'T',
  'e': 'P',
  'r': 'H',
  't': '*',
  'y': '*',
  'u': 'F',
  'i': 'P',
  'o': 'L',
  'p': 'T',
  '[': 'D',

  'a': 'S',
  's': 'K',
  'd': 'W',
  'f': 'R',
  'g': '*',
  'h': '*',
  'j': 'R',
  'k': 'B',
  'l': 'G',
  ';': 'S',
  "'": 'Z',
  'c': 'A', // Vowel: A
  'v': 'O', // Vowel: O
  'n': 'E', // Vowel: E
  'm': 'U', // Vowel: U
  // Add more key-to-stroke mappings as needed
};

async function translateWithMainJSON(formattedStrokes) {
  // Fetch the main.json file
  const mainJSON = await fetchMainJSON();
  resetFormattedStrokes();
  console.log('Commencing translation, formattedStrokes is:' + formattedStrokes)

  if (mainJSON) {
    // Perform the translation lookup
    const translation = mainJSON[formattedStrokes] || '';

    // Call the injectTranslatedText function to inject translated text into the active input field
    injectTranslatedText(translation);

    // Log the translation and formattedStrokes here
    console.log("Output: " + translation);
    console.log("Input: " + formattedStrokes);
  }
}

// Add this function to inject translated text into the active input field
function injectTranslatedText(translatedText) {
  // Detect the active input field (new tab text field)
  const activeInput = document.activeElement;

  // Check if the active input field is a text input or textarea
  if (activeInput && (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA')) {
    // Inject the translated text into the active input field
    activeInput.value += translatedText;
  }
}

// Define the steno order (replace with your specific order)
const stenoOrder = 'STKPWHRAO*EUFRPBLGTSDZ';

// Rest of your code...

// Function to enable translation
function enableTranslation() {
  translationEnabled = true;
  console.log('Translation enabled.');
}

// Function to disable translation
function disableTranslation() {
  translationEnabled = false;
  console.log('Translation disabled.');
}
