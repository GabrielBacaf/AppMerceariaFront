const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('generate_tests.cjs', 'utf-8');

content = content.replace(/\/\/ Check if Alert success is shown.*?expect\(text\)\.toContain.*?;/gs, '');

content = content.replace(/import \{ mount \} from '@vue\/test-utils';/g, "import { mount } from '@vue/test-utils';\nimport { showAlert } from '../src/utils/alert';\nvi.mock('../src/utils/alert', () => ({ showAlert: { success: vi.fn(), error: vi.fn() } }));");

content = content.replace(/await new Promise\(resolve => setTimeout\(resolve, 0\)\);\s*\}\);/g, "await new Promise(resolve => setTimeout(resolve, 0));\n    expect(showAlert.success).toHaveBeenCalled();\n  });");

fs.writeFileSync('generate_tests.cjs', content);
console.log('Test generator updated');
