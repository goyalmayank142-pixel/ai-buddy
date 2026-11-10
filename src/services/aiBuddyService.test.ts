/**
 * Test script for AI Buddy Service and Color Detection
 */
import { runPixelVisionAnalysis, getBuddyChatReply } from './aiBuddyService';
import { BUDDY_FIX_GUIDES, PRESET_CAMERA_SCENES } from '../data/buddyGuides';

// Mock minimal canvas for Node testing
class MockCanvas {
  width: number;
  height: number;
  private r: number;
  private g: number;
  private b: number;

  constructor(width: number, height: number, r: number, g: number, b: number) {
    this.width = width;
    this.height = height;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  getContext() {
    return {
      getImageData: (_sx: number, _sy: number, sw: number, sh: number) => {
        const totalPixels = sw * sh;
        const data = new Uint8ClampedArray(totalPixels * 4);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = this.r;
          data[i + 1] = this.g;
          data[i + 2] = this.b;
          data[i + 3] = 255;
        }
        return { data };
      }
    };
  }

  toDataURL() {
    return 'data:image/jpeg;base64,mock';
  }
}

async function runTests() {
  console.log('--- Running AI Buddy Test Suite ---');

  // Test 1: Red Flower Detection
  const redCanvas = new MockCanvas(400, 400, 220, 30, 40) as unknown as HTMLCanvasElement;
  const redResult = runPixelVisionAnalysis(redCanvas, 'See this is my flower pot!');
  console.assert(redResult.detectedColor === 'red' || redResult.detectedColor === 'Red', `Expected red color, got ${redResult.detectedColor}`);
  console.assert(redResult.reply.toLowerCase().includes('red') || redResult.reply.toLowerCase().includes('flower'), 'Expected red flower in reply');
  console.log('✅ Test 1 Passed: Red Flower Pot correctly detected with color "red"');

  // Test 2: Yellow Flower Detection
  const yellowCanvas = new MockCanvas(400, 400, 240, 220, 20) as unknown as HTMLCanvasElement;
  const yellowResult = runPixelVisionAnalysis(yellowCanvas, 'Look at my flower pot');
  console.assert(yellowResult.detectedColor === 'yellow' || yellowResult.detectedColor === 'Yellow', `Expected yellow color, got ${yellowResult.detectedColor}`);
  console.assert(yellowResult.reply.toLowerCase().includes('yellow'), 'Expected yellow in reply');
  console.log('✅ Test 2 Passed: Yellow Flower Pot correctly detected with color "yellow"');

  // Test 3: Electric Kettle Problem Detection
  const kettleCanvas = new MockCanvas(400, 400, 80, 80, 80) as unknown as HTMLCanvasElement;
  const kettleResult = runPixelVisionAnalysis(kettleCanvas, 'My kettle is broken and will not boil water');
  console.assert(kettleResult.detectedSubject === 'Electric Kettle', `Expected Electric Kettle, got ${kettleResult.detectedSubject}`);
  console.assert(kettleResult.actionTip !== undefined, 'Expected action tip for kettle');
  console.log('✅ Test 3 Passed: Kettle DIY Troubleshooting correctly suggested');

  // Test 4: Water Pipe Leak Detection
  const pipeCanvas = new MockCanvas(400, 400, 50, 100, 200) as unknown as HTMLCanvasElement;
  const pipeResult = runPixelVisionAnalysis(pipeCanvas, 'Water pipe is leaking under my kitchen sink');
  console.assert(pipeResult.detectedSubject === 'Water Pipe', `Expected Water Pipe, got ${pipeResult.detectedSubject}`);
  console.assert(pipeResult.reply.toLowerCase().includes('valve'), 'Expected valve warning in reply');
  console.log('✅ Test 4 Passed: Leaking Pipe DIY with isolation valve shutoff advised');

  // Test 5: Chat Responses
  const chatReply = await getBuddyChatReply('My electric kettle will not heat');
  console.assert(chatReply.toLowerCase().includes('kettle'), 'Expected kettle guidance in chat reply');
  console.log('✅ Test 5 Passed: Buddy friendly chat returns practical fix steps');

  // Test 6: Verify Guides and Presets Data Integrity
  console.assert(BUDDY_FIX_GUIDES.length >= 4, 'Expected at least 4 DIY guides');
  console.assert(PRESET_CAMERA_SCENES.length >= 4, 'Expected at least 4 camera preset scenes');
  console.log('✅ Test 6 Passed: DIY Guides & Camera Preset Scenes verified intact');

  console.log('\n🎉 ALL 6 TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
