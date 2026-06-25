const fs = require('fs');
const path = require('path');

const viewsDir = 'src/views';
const entities = ['users', 'clients', 'roles', 'suppliers', 'sales', 'products', 'purchases'];

entities.forEach(entity => {
  ['create.vue', 'edit.vue'].forEach(file => {
    const filePath = path.join(viewsDir, entity, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace Alert import
    content = content.replace(/import Alert from '..\/..\/components\/ui\/Alert.vue';\r?\n/, "import { showAlert } from '../../utils/alert';\n");

    // Remove Alert state
    content = content.replace(/const alert = ref\(\{ show: false, type: 'success', message: '' \}\);\r?\n/, '');

    // Remove alert reset in handleSave
    content = content.replace(/alert\.value\.show = false;\r?\n/, '');
    
    // In edit.vue, remove alert in onMounted catch
    content = content.replace(/alert\.value = \{ show: true, type: 'error', message: 'Erro ao carregar dados\.' \};/g, "showAlert.error('Erro ao carregar dados.');");

    // Replace success alert
    content = content.replace(/alert\.value = \{ show: true, type: 'success', message: '(.*?)' \};/g, "showAlert.success('$1');");

    // Replace error alert block
    content = content.replace(/alert\.value = \{\s*show: true,\s*type: 'error',\s*message: error\.response\?\.data\?\.message \|\| 'Erro ao .*?'\s*\};/gs, "showAlert.error(error);");

    // Remove <Alert /> component in template
    content = content.replace(/<Alert :show="alert\.show" :type="alert\.type" :message="alert\.message" \/>\r?\n/, '');

    fs.writeFileSync(filePath, content);
  });
});

console.log('Refactoring complete!');
