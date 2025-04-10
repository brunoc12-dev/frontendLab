<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="0" class="rounded-xl pa-2" color="cardColor">
          <v-card-title>
            <h1 class="text-h4 mb-2 font-weight-bold"><v-icon size="large" class="mr-2">mdi-view-dashboard</v-icon> DASHBOARD</h1>
            <h1 class="text-subtitle-2 font-weight-light">Este es el dashboard principal del módulo de Contabilidad.</h1>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4" justify="center">
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          to="/contabilidad/dashboard"
          variant="outlined"
          color="primary"
          class="mx-2"
          min-width="250"
        >
          DASHBOARD
        </v-btn>
        <v-btn
          to="/contabilidad"
          variant="outlined"
          color="primary"
          class="mx-2"
          min-width="250"
        >
          SUBIR ARCHIVOS
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-8" justify="end">
      <v-col cols="12" v-if="errorMessage">
        <v-alert
          type="error"
          variant="tonal"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Mes"
          variant="solo"
          density="compact"
          class="rounded-pill bg-light-purple"
          @update:model-value="fetchFilteredData"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Año"
          variant="solo"
          density="compact"
          class="rounded-pill bg-light-purple"
          @update:model-value="fetchFilteredData"
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="6">
        <v-card 
          class="pa-4 rounded-4 bg-light-purple"
          @click="showDocumentsByType('pago')"
          :class="{'cursor-pointer': statistics.pago.files.length > 0}"
          variant="elevated"
          elevation="0"
          color="surface-variant"
        >
          <h3 class="text-h6 font-weight-bold mb-4">Comprobantes de Pago</h3>
          <div class="d-flex align-center mb-3">
            <v-icon size="x-large" class="mr-3">mdi-file-document-outline</v-icon>
            <div>Total de Comprobantes: {{ statistics.pago.count }}</div>
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-large" class="mr-3">mdi-currency-usd</v-icon>
            <div>Monto Total: ${{ statistics.pago.amount }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card 
          class="pa-4 rounded-4 bg-light-purple"
          @click="showDocumentsByType('ingreso')"
          :class="{'cursor-pointer': statistics.ingreso.files.length > 0}"
          variant="elevated"
          elevation="0"
          color="surface-variant"
        >
          <h3 class="text-h6 font-weight-bold mb-4">Comprobantes de Ingreso</h3>
          <div class="d-flex align-center mb-3">
            <v-icon size="x-large" class="mr-3">mdi-file-document-outline</v-icon>
            <div>Total de Comprobantes: {{ statistics.ingreso.count }}</div>
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-large" class="mr-3">mdi-currency-usd</v-icon>
            <div>Monto Total: ${{ statistics.ingreso.amount }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="6">
        <v-card 
          class="pa-4 rounded-4 bg-light-purple"
          @click="showDocumentsByType('egreso')"
          :class="{'cursor-pointer': statistics.egreso.files.length > 0}"
          variant="elevated"
          elevation="0"
          color="surface-variant"
        >
          <h3 class="text-h6 font-weight-bold mb-4">Comprobantes de Egreso</h3>
          <div class="d-flex align-center mb-3">
            <v-icon size="x-large" class="mr-3">mdi-file-document-outline</v-icon>
            <div>Total de Comprobantes: {{ statistics.egreso.count }}</div>
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-large" class="mr-3">mdi-currency-usd</v-icon>
            <div>Monto Total: ${{ statistics.egreso.amount }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card 
          class="pa-4 rounded-4 bg-light-purple"
          @click="showDocumentsByType('traslado')"
          :class="{'cursor-pointer': statistics.traslado.files.length > 0}"
          variant="elevated"
          elevation="0"
          color="surface-variant"
        >
          <h3 class="text-h6 font-weight-bold mb-4">Comprobantes de Traslado</h3>
          <div class="d-flex align-center mb-3">
            <v-icon size="x-large" class="mr-3">mdi-file-document-outline</v-icon>
            <div>Total de Comprobantes: {{ statistics.traslado.count }}</div>
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-large" class="mr-3">mdi-currency-usd</v-icon>
            <div>Monto Total: ${{ statistics.traslado.amount }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Document list dialog -->
    <v-dialog v-model="documentDialog" max-width="900px">
      <v-card>
        <v-toolbar :color="getDialogColor()" dark>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="documentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in selectedDocuments" :key="index">
                <td>{{ doc.date ? new Date(doc.date).toLocaleDateString() : '-' }}</td>
                <td>{{ doc.filename || doc.name }}</td>
                <td>${{ formatAmount(doc.amount) }}</td>
                <td>{{ getTypeLabel(doc.type || doc.tipo_comprobante) }}</td>
              </tr>
              <tr v-if="selectedDocuments.length === 0">
                <td colspan="4" class="text-center">No hay documentos para mostrar</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref('');

const statistics = ref({
  pago: { count: 0, amount: '0.00', files: [] },
  ingreso: { count: 0, amount: '0.00', files: [] },
  egreso: { count: 0, amount: '0.00', files: [] },
  traslado: { count: 0, amount: '0.00', files: [] }
});


const currentDate = new Date();
const selectedMonth = ref(currentDate.getMonth() + 1); 
const selectedYear = ref(currentDate.getFullYear());

const months = [
  { title: 'Enero', value: 1 },
  { title: 'Febrero', value: 2 },
  { title: 'Marzo', value: 3 },
  { title: 'Abril', value: 4 },
  { title: 'Mayo', value: 5 },
  { title: 'Junio', value: 6 },
  { title: 'Julio', value: 7 },
  { title: 'Agosto', value: 8 },
  { title: 'Septiembre', value: 9 },
  { title: 'Octubre', value: 10 },
  { title: 'Noviembre', value: 11 },
  { title: 'Diciembre', value: 12 }
];

const years = [currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1];

// Dialog related refs and functions
const documentDialog = ref(false);
const dialogTitle = ref('');
const selectedDocuments = ref([]);
const currentType = ref('');

const showDocumentsByType = (type) => {
  if (statistics.value[type].files.length === 0) return;
  
  currentType.value = type;
  selectedDocuments.value = statistics.value[type].files;
  
  switch (type) {
    case 'pago':
      dialogTitle.value = 'Comprobantes de Pago';
      break;
    case 'ingreso':
      dialogTitle.value = 'Comprobantes de Ingreso';
      break;
    case 'egreso':
      dialogTitle.value = 'Comprobantes de Egreso';
      break;
    case 'traslado':
      dialogTitle.value = 'Comprobantes de Traslado';
      break;
    default:
      dialogTitle.value = 'Documentos';
  }
  
  documentDialog.value = true;
};

const getDialogColor = () => {
  switch (currentType.value) {
    case 'pago': return 'success';
    case 'ingreso': return 'primary';
    case 'egreso': return 'error';
    case 'traslado': return 'warning';
    default: return 'primary';
  }
};


const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00';
  

  if (typeof amount === 'string' && amount.includes(',')) {
    return amount;
  }
  
 
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0.00';
  
  return numAmount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};


const getTypeLabel = (type) => {
  if (!type) return 'Desconocido';
  
  const typeMap = {
    'P': 'Pago',
    'I': 'Ingreso',
    'E': 'Egreso',
    'T': 'Traslado'
  };
  
  const uppercaseType = String(type).toUpperCase().charAt(0);
  return typeMap[uppercaseType] || 'Desconocido';
};

const checkAuth = () => {
  if (!authStore.isAuthenticated) {
    console.warn('User not authenticated, redirecting to login');
    router.push('/login');
    return false;
  }
  return true;
};

const getStatistics = async () => {
  if (!checkAuth()) return;
  
  try {
    console.log(`Fetching statistics for ${months.find(m => m.value === selectedMonth.value)?.title} ${selectedYear.value}`);
    
   
    const latestResponse = await api.getLatestXmlDocuments(10); // Get 10 latest documents
    console.log('Latest XML documents:', latestResponse.data);
    
   
    const response = await api.getXmlStatistics(selectedMonth.value, selectedYear.value);
    console.log('API Response:', response.data);
    
    if (response.data) {

      const typeToCategory = {
        'P': 'pago',
        'I': 'ingreso',
        'E': 'egreso',
        'T': 'traslado'
      };
      
      
      const stats = {
        pago: { count: 0, amount: 0, files: [] },
        ingreso: { count: 0, amount: 0, files: [] },
        egreso: { count: 0, amount: 0, files: [] },
        traslado: { count: 0, amount: 0, files: [] }
      };
  
      const extractAmount = (doc) => {
       
        const amountProperties = ['amount', 'total', 'Total', 'subTotal', 'SubTotal', 'monto', 'importe', 'value'];
        
        
        for (const prop of amountProperties) {
          if (doc[prop] !== undefined && doc[prop] !== null) {
            const strAmount = String(doc[prop]).replace(/[^\d.,]/g, '').replace(/,/g, '.');
            const parsedAmount = parseFloat(strAmount);
            if (!isNaN(parsedAmount)) {
              console.log(`Found amount ${parsedAmount} in property ${prop} for file ${doc.filename || doc.name}`);
              return parsedAmount;
            }
          }
        }
        
  
        if (doc.data && typeof doc.data === 'object') {
          for (const prop of amountProperties) {
            if (doc.data[prop] !== undefined && doc.data[prop] !== null) {
              const strAmount = String(doc.data[prop]).replace(/[^\d.,]/g, '').replace(/,/g, '.');
              const parsedAmount = parseFloat(strAmount);
              if (!isNaN(parsedAmount)) {
                console.log(`Found amount ${parsedAmount} in data.${prop} for file ${doc.filename || doc.name}`);
                return parsedAmount;
              }
            }
          }
        }
        
        // XML content extraction - improved regex to capture amounts from both quotes and apostrophes
        if (doc.content && typeof doc.content === 'string' && doc.content.includes('<')) {
          // Try Total first - handle both quote types and any format with commas or dots
          const totalMatch = doc.content.match(/Total=['"]([0-9,.]+)['"]/i);
          if (totalMatch && totalMatch[1]) {
            const strAmount = totalMatch[1].replace(/,/g, '.');
            const parsedAmount = parseFloat(strAmount);
            if (!isNaN(parsedAmount)) {
              console.log(`Found amount ${parsedAmount} in XML Total attribute for file ${doc.filename || doc.name}`);
              return parsedAmount;
            }
          }
          
          // Try SubTotal if Total not found
          const subTotalMatch = doc.content.match(/SubTotal=['"]([0-9,.]+)['"]/i);
          if (subTotalMatch && subTotalMatch[1]) {
            const strAmount = subTotalMatch[1].replace(/,/g, '.');
            const parsedAmount = parseFloat(strAmount);
            if (!isNaN(parsedAmount)) {
              console.log(`Found amount ${parsedAmount} in XML SubTotal attribute for file ${doc.filename || doc.name}`);
              return parsedAmount;
            }
          }
          
          // Additional pattern: look for Total between tags
          const totalTagMatch = doc.content.match(/<Total>([0-9,.]+)<\/Total>/i);
          if (totalTagMatch && totalTagMatch[1]) {
            const strAmount = totalTagMatch[1].replace(/,/g, '.');
            const parsedAmount = parseFloat(strAmount);
            if (!isNaN(parsedAmount)) {
              console.log(`Found amount ${parsedAmount} in XML Total tag for file ${doc.filename || doc.name}`);
              return parsedAmount;
            }
          }
        }
        
        // If no amount found, use 0
        console.log(`No amount found for file ${doc.filename || doc.name}, using 0`);
        return 0;
      };
      
      // Enhanced helper function to find files in the response
      const findFiles = (data) => {
        if (!data) return [];
        
        // Check if data is an array directly
        if (Array.isArray(data)) {
          console.log(`Found direct array of ${data.length} files`);
          return data;
        }
        
        // Common properties that might contain file arrays
        const arrayProps = ['documents', 'files', 'results', 'items', 'recent_files', 'xml_files', 'xmlFiles', 'documentos'];
        
        for (const prop of arrayProps) {
          if (data[prop] && Array.isArray(data[prop])) {
            console.log(`Found ${data[prop].length} files in ${prop} property`);
            return data[prop];
          }
        }
        
        // If we have nested properties, look inside them
        for (const key in data) {
          if (data[key] && typeof data[key] === 'object') {
            // Check if this property is an array of files
            if (Array.isArray(data[key])) {
              // Verify if array elements have file-like properties
              if (data[key].length > 0 && 
                  (data[key][0].filename || data[key][0].name || data[key][0].type || data[key][0].date)) {
                console.log(`Found ${data[key].length} files in ${key} property`);
                return data[key];
              }
            }
            // Recursively check nested objects (but avoid circular structures)
            if (data[key] !== data && !Array.isArray(data[key])) {
              const nestedFiles = findFiles(data[key]);
              if (nestedFiles.length > 0) {
                return nestedFiles;
              }
            }
          }
        }
        
        return [];
      };
      
      // Find all files in the response
      const files = findFiles(response.data);
      console.log(`Found ${files.length} files in the response`);
      
      // Also include the latest files if they're not already in the files array
      const latestFiles = latestResponse.data || [];
      console.log(`Found ${latestFiles.length} latest files`);
      
      // Combine files and latest files, avoiding duplicates
      const allFiles = [...files];
      
      // Add latest files that aren't already in the files array
      latestFiles.forEach(latestFile => {
        const fileExists = allFiles.some(file => 
          file.id === latestFile.id || 
          file.filename === latestFile.filename || 
          file.name === latestFile.filename
        );
        
        if (!fileExists) {
          allFiles.push(latestFile);
        }
      });
      
      console.log(`Combined ${allFiles.length} total files`);
      
      if (allFiles.length > 0) {
        // Process each file
        allFiles.forEach(doc => {
          if (!doc || typeof doc !== 'object') return;
          
          // Determine file type
          let fileType = doc.type;
          if (!fileType && doc.tipo_comprobante) {
            fileType = doc.tipo_comprobante;
          } else if (!fileType && doc.tipoComprobante) {
            fileType = doc.tipoComprobante;
          } else if (!fileType && doc.tipoDeComprobante) {
            fileType = doc.tipoDeComprobante;
          }
          
          // Normalize type to P, I, E, T format
          if (fileType) {
            if (typeof fileType === 'string') {
              const uppercaseType = fileType.toUpperCase().charAt(0);
              if (['P', 'I', 'E', 'T'].includes(uppercaseType)) {
                fileType = uppercaseType;
              } else if (fileType.toLowerCase().includes('pago')) {
                fileType = 'P';
              } else if (fileType.toLowerCase().includes('ingreso')) {
                fileType = 'I';
              } else if (fileType.toLowerCase().includes('egreso')) {
                fileType = 'E';
              } else if (fileType.toLowerCase().includes('traslado')) {
                fileType = 'T';
              }
            }
          } else {
            // Try to extract type from XML content if available
            if (doc.content && typeof doc.content === 'string' && doc.content.includes('<')) {
              // Look for tipoComprobante attribute
              const tipoMatch = doc.content.match(/tipoComprobante=['"]([A-Za-z0-9]+)['"]/i);
              if (tipoMatch && tipoMatch[1]) {
                const tipo = tipoMatch[1].toUpperCase();
                if (tipo.includes('P') || tipo.includes('PAGO')) {
                  fileType = 'P';
                } else if (tipo.includes('I') || tipo.includes('INGRESO')) {
                  fileType = 'I';
                } else if (tipo.includes('E') || tipo.includes('EGRESO')) {
                  fileType = 'E';
                } else if (tipo.includes('T') || tipo.includes('TRASLADO')) {
                  fileType = 'T';
                }
                console.log(`Extracted type ${fileType} from XML tipoComprobante for file ${doc.filename || doc.name}`);
              }
              
              // Look for TipoDeComprobante tag
              const tipoTagMatch = doc.content.match(/<TipoDeComprobante>([A-Za-z0-9]+)<\/TipoDeComprobante>/i);
              if (tipoTagMatch && tipoTagMatch[1]) {
                const tipo = tipoTagMatch[1].toUpperCase();
                if (tipo.includes('P') || tipo.includes('PAGO')) {
                  fileType = 'P';
                } else if (tipo.includes('I') || tipo.includes('INGRESO')) {
                  fileType = 'I';
                } else if (tipo.includes('E') || tipo.includes('EGRESO')) {
                  fileType = 'E';
                } else if (tipo.includes('T') || tipo.includes('TRASLADO')) {
                  fileType = 'T';
                }
                console.log(`Extracted type ${fileType} from XML TipoDeComprobante tag for file ${doc.filename || doc.name}`);
              }
              
              // Check filename patterns if still no type
              if (!fileType) {
                const filename = doc.filename || doc.name || '';
                if (filename.startsWith('P') || filename.includes('PAGO')) {
                  fileType = 'P';
                } else if (filename.startsWith('I') || filename.includes('INGRESO')) {
                  fileType = 'I';
                } else if (filename.startsWith('E') || filename.includes('EGRESO')) {
                  fileType = 'E';
                } else if (filename.startsWith('T') || filename.includes('TRASLADO')) {
                  fileType = 'T';
                }
                console.log(`Determined type ${fileType} from filename pattern for file ${filename}`);
              }
            }
            
            // Default to I if still no type found
            if (!fileType) {
              fileType = 'I';
              console.log(`No type found for file ${doc.filename || doc.name}, defaulting to I`);
            }
          }
          
          // Map to category name
          const category = typeToCategory[fileType] || 'unknown';
          if (stats[category]) {
            // Extract amount
            const amount = extractAmount(doc);
            
            // Create a copy of the document with the amount included
            const documentWithAmount = {
              ...doc,
              amount: amount
            };
            
            // Update statistics
            stats[category].count++;
            stats[category].amount += amount;
            stats[category].files.push(documentWithAmount);
          }
        });
      }
      
      // Format amount values with commas and decimal places
      for (const category in stats) {
        stats[category].amount = stats[category].amount.toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        console.log(`${category}: ${stats[category].count} files, total amount: ${stats[category].amount}`);
      }
      
      // Use API totals if provided, otherwise use our calculated values
      statistics.value = {
        pago: { 
          count: response.data.pago?.count || stats.pago.count, 
          amount: response.data.pago?.total_amount?.toLocaleString() || stats.pago.amount,
          files: stats.pago.files
        },
        ingreso: { 
          count: response.data.ingreso?.count || stats.ingreso.count, 
          amount: response.data.ingreso?.total_amount?.toLocaleString() || stats.ingreso.amount,
          files: stats.ingreso.files
        },
        egreso: { 
          count: response.data.egreso?.count || stats.egreso.count, 
          amount: response.data.egreso?.total_amount?.toLocaleString() || stats.egreso.amount,
          files: stats.egreso.files
        },
        traslado: { 
          count: response.data.traslado?.count || stats.traslado.count, 
          amount: response.data.traslado?.total_amount?.toLocaleString() || stats.traslado.amount,
          files: stats.traslado.files
        }
      };
      
      console.log('Processed statistics:', statistics.value);
    }
  } catch (error) {
    console.error('Error fetching XML statistics:', error);
    errorMessage.value = 'Error al cargar las estadísticas.';
  }
};

const fetchFilteredData = async () => {
  console.log(`Filtering data for month: ${selectedMonth.value}, year: ${selectedYear.value}`);
  await getStatistics();
};

onMounted(() => {
  if (checkAuth()) {
    getStatistics();
  }
});
</script>

<style scoped>
.bg-light-purple {
  background-color: #f8f7fc !important;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.cursor-pointer:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.05);
}
</style> 