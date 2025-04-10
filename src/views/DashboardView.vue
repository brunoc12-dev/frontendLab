<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="0" class="rounded-xl pa-2" color="cardColor">
          <v-card-title>
            <h1 class="text-h4 mb-2 font-weight-bold"><v-icon size="large" class="mr-2">mdi-view-dashboard</v-icon> Dashboard</h1>
            <h1 class="text-subtitle-2 font-weight-light">Vista para visualizar métricas en general de la aplicación</h1>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Task Summary Cards -->
    <v-row class="mt-4">
      <v-col cols="12" md="3">
        <v-card elevation="0" class="rounded-xl pa-2" color="success">
          <v-card-title class="text-white">
            <v-icon size="large" color="white" class="mr-2">mdi-check-circle</v-icon>
            Tareas Completadas
          </v-card-title>
          <v-card-text class="text-h4 text-white">
            {{ completedTasks }}
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card elevation="0" class="rounded-xl pa-2" color="primary">
          <v-card-title class="text-white">
            <v-icon size="large" color="white" class="mr-2">mdi-progress-clock</v-icon>
            Tareas en Progreso
          </v-card-title>
          <v-card-text class="text-h4 text-white">
            {{ inProgressTasks }}
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card elevation="0" class="rounded-xl pa-2" color="warning">
          <v-card-title class="text-white">
            <v-icon size="large" color="white" class="mr-2">mdi-alert</v-icon>
            Tareas Pendientes
          </v-card-title>
          <v-card-text class="text-h4 text-white">
            {{ pendingTasks }}
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card elevation="0" class="rounded-xl pa-2" color="error">
          <v-card-title class="text-white">
            <v-icon size="large" color="white" class="mr-2">mdi-cancel</v-icon>
            Tareas Canceladas
          </v-card-title>
          <v-card-text class="text-h4 text-white">
            {{ cancelledTasks }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Task Filter Controls -->
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Buscar tareas"
          variant="outlined"
          density="comfortable"
          hide-details
          class="rounded-pill"
          @input="filterTasks"
        ></v-text-field>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedPriority"
          :items="priorityOptions"
          label="Prioridad"
          variant="outlined"
          density="comfortable"
          hide-details
          class="rounded-pill"
          @update:model-value="filterTasks"
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedAssignee"
          :items="assigneeOptions"
          label="Asignado a"
          variant="outlined"
          density="comfortable"
          hide-details
          class="rounded-pill"
          @update:model-value="filterTasks"
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          color="primary"
          class="rounded-pill"
          @click="showNewTaskDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Nueva Tarea
        </v-btn>
      </v-col>
    </v-row>

    <!-- Jira-like Kanban Board -->
    <v-row class="mt-4">
      <v-col cols="12">
        <div class="d-flex kanban-board">
          <!-- Pendiente Column -->
          <div class="kanban-column">
            <div class="kanban-column-header bg-warning-lighten-1">
              <h3 class="text-h6 font-weight-bold">Pendiente</h3>
              <v-chip color="warning" class="ml-2">{{ filteredTasks.pendiente.length }}</v-chip>
            </div>
            <div class="kanban-column-content">
              <v-card
                v-for="task in filteredTasks.pendiente"
                :key="task.id"
                class="mb-2 task-card"
                @click="openTaskDetails(task)"
              >
                <v-card-title class="text-subtitle-1 py-2">
                  {{ task.title }}
                </v-card-title>
                <v-card-text class="py-1">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="small" :color="getPriorityColor(task.priority)" class="mr-1">mdi-flag</v-icon>
                    <span class="text-caption">{{ task.priority }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-1">
                      <v-img :src="task.assignee_avatar || 'https://via.placeholder.com/24'" alt="avatar"></v-img>
                    </v-avatar>
                    <span class="text-caption">{{ task.assignee || 'Sin asignar' }}</span>
                  </div>
                </v-card-text>
              </v-card>
              <div v-if="filteredTasks.pendiente.length === 0" class="text-center pa-4 text-medium-emphasis">
                No hay tareas pendientes
              </div>
            </div>
          </div>
          
          <!-- En Progreso Column -->
          <div class="kanban-column">
            <div class="kanban-column-header bg-primary-lighten-1">
              <h3 class="text-h6 font-weight-bold">En Progreso</h3>
              <v-chip color="primary" class="ml-2">{{ filteredTasks.en_progreso.length }}</v-chip>
            </div>
            <div class="kanban-column-content">
              <v-card
                v-for="task in filteredTasks.en_progreso"
                :key="task.id"
                class="mb-2 task-card"
                @click="openTaskDetails(task)"
              >
                <v-card-title class="text-subtitle-1 py-2">
                  {{ task.title }}
                </v-card-title>
                <v-card-text class="py-1">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="small" :color="getPriorityColor(task.priority)" class="mr-1">mdi-flag</v-icon>
                    <span class="text-caption">{{ task.priority }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-1">
                      <v-img :src="task.assignee_avatar || 'https://via.placeholder.com/24'" alt="avatar"></v-img>
                    </v-avatar>
                    <span class="text-caption">{{ task.assignee || 'Sin asignar' }}</span>
                  </div>
                </v-card-text>
              </v-card>
              <div v-if="filteredTasks.en_progreso.length === 0" class="text-center pa-4 text-medium-emphasis">
                No hay tareas en progreso
              </div>
            </div>
          </div>
          
          <!-- Completada Column -->
          <div class="kanban-column">
            <div class="kanban-column-header bg-success-lighten-1">
              <h3 class="text-h6 font-weight-bold">Completada</h3>
              <v-chip color="success" class="ml-2">{{ filteredTasks.completada.length }}</v-chip>
            </div>
            <div class="kanban-column-content">
              <v-card
                v-for="task in filteredTasks.completada"
                :key="task.id"
                class="mb-2 task-card"
                @click="openTaskDetails(task)"
              >
                <v-card-title class="text-subtitle-1 py-2">
                  {{ task.title }}
                </v-card-title>
                <v-card-text class="py-1">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="small" :color="getPriorityColor(task.priority)" class="mr-1">mdi-flag</v-icon>
                    <span class="text-caption">{{ task.priority }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-1">
                      <v-img :src="task.assignee_avatar || 'https://via.placeholder.com/24'" alt="avatar"></v-img>
                    </v-avatar>
                    <span class="text-caption">{{ task.assignee || 'Sin asignar' }}</span>
                  </div>
                </v-card-text>
              </v-card>
              <div v-if="filteredTasks.completada.length === 0" class="text-center pa-4 text-medium-emphasis">
                No hay tareas completadas
              </div>
            </div>
          </div>
          
          <!-- Cancelada Column -->
          <div class="kanban-column">
            <div class="kanban-column-header bg-error-lighten-1">
              <h3 class="text-h6 font-weight-bold">Cancelada</h3>
              <v-chip color="error" class="ml-2">{{ filteredTasks.cancelada.length }}</v-chip>
            </div>
            <div class="kanban-column-content">
              <v-card
                v-for="task in filteredTasks.cancelada"
                :key="task.id"
                class="mb-2 task-card"
                @click="openTaskDetails(task)"
              >
                <v-card-title class="text-subtitle-1 py-2">
                  {{ task.title }}
                </v-card-title>
                <v-card-text class="py-1">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="small" :color="getPriorityColor(task.priority)" class="mr-1">mdi-flag</v-icon>
                    <span class="text-caption">{{ task.priority }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-1">
                      <v-img :src="task.assignee_avatar || 'https://via.placeholder.com/24'" alt="avatar"></v-img>
                    </v-avatar>
                    <span class="text-caption">{{ task.assignee || 'Sin asignar' }}</span>
                  </div>
                </v-card-text>
              </v-card>
              <div v-if="filteredTasks.cancelada.length === 0" class="text-center pa-4 text-medium-emphasis">
                No hay tareas canceladas
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Task Details Dialog -->
    <v-dialog v-model="taskDetailsDialog" max-width="700px">
      <v-card v-if="selectedTask">
        <v-toolbar :color="getStatusColor(selectedTask.status)" dark>
          <v-toolbar-title>{{ selectedTask.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="taskDetailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12" md="8">
              <h3 class="text-h6 mb-2">Descripción</h3>
              <p>{{ selectedTask.description || 'Sin descripción' }}</p>
              
              <h3 class="text-h6 mb-2 mt-4">Comentarios</h3>
              <div v-if="selectedTask.comments && selectedTask.comments.length > 0">
                <v-card v-for="(comment, index) in selectedTask.comments" :key="index" class="mb-2">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-avatar size="32" class="mr-2">
                        <v-img :src="comment.user_avatar || 'https://via.placeholder.com/32'" alt="avatar"></v-img>
                      </v-avatar>
                      <div>
                        <div class="font-weight-bold">{{ comment.user }}</div>
                        <div class="text-caption">{{ formatDate(comment.date) }}</div>
                      </div>
                    </div>
                    <p>{{ comment.text }}</p>
                  </v-card-text>
                </v-card>
              </div>
              <div v-else class="text-medium-emphasis">
                No hay comentarios
              </div>
              
              <v-textarea
                v-model="newComment"
                label="Agregar comentario"
                variant="outlined"
                class="mt-2"
                rows="2"
              ></v-textarea>
              <v-btn color="primary" class="mt-2" @click="addComment">Agregar comentario</v-btn>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card class="mb-4">
                <v-card-text>
                  <div class="d-flex align-center mb-2">
                    <span class="font-weight-bold mr-2">Estado:</span>
                    <v-chip :color="getStatusColor(selectedTask.status)" size="small">
                      {{ getStatusLabel(selectedTask.status) }}
                    </v-chip>
                  </div>
                  
                  <div class="d-flex align-center mb-2">
                    <span class="font-weight-bold mr-2">Prioridad:</span>
                    <v-chip :color="getPriorityColor(selectedTask.priority)" size="small">
                      {{ selectedTask.priority }}
                    </v-chip>
                  </div>
                  
                  <div class="d-flex align-center mb-2">
                    <span class="font-weight-bold mr-2">Asignado a:</span>
                    <span>{{ selectedTask.assignee || 'Sin asignar' }}</span>
                  </div>
                  
                  <div class="d-flex align-center mb-2">
                    <span class="font-weight-bold mr-2">Creado:</span>
                    <span>{{ formatDate(selectedTask.created_at) }}</span>
                  </div>
                  
                  <div class="d-flex align-center mb-2">
                    <span class="font-weight-bold mr-2">Actualizado:</span>
                    <span>{{ formatDate(selectedTask.updated_at) }}</span>
                  </div>
                </v-card-text>
              </v-card>
              
              <v-card>
                <v-card-text>
                  <h3 class="text-h6 mb-2">Cambiar estado</h3>
                  <v-select
                    v-model="selectedTask.status"
                    :items="statusOptions"
                    label="Estado"
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateTaskStatus"
                  ></v-select>
                  
                  <h3 class="text-h6 mb-2 mt-4">Cambiar asignación</h3>
                  <v-select
                    v-model="selectedTask.assignee"
                    :items="assigneeOptions"
                    label="Asignado a"
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateTaskAssignee"
                  ></v-select>
                  
                  <h3 class="text-h6 mb-2 mt-4">Cambiar prioridad</h3>
                  <v-select
                    v-model="selectedTask.priority"
                    :items="priorityOptions"
                    label="Prioridad"
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateTaskPriority"
                  ></v-select>
                  
                  <v-btn 
                    color="error" 
                    variant="outlined" 
                    class="mt-4" 
                    block
                    @click="confirmDeleteTask"
                  >
                    Eliminar tarea
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- New Task Dialog -->
    <v-dialog v-model="showNewTaskDialog" max-width="600px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Nueva Tarea</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showNewTaskDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-form ref="newTaskForm">
            <v-text-field
              v-model="newTask.title"
              label="Título"
              variant="outlined"
              required
              :rules="[v => !!v || 'El título es requerido']"
            ></v-text-field>
            
            <v-textarea
              v-model="newTask.description"
              label="Descripción"
              variant="outlined"
              rows="3"
            ></v-textarea>
            
            <v-select
              v-model="newTask.priority"
              :items="priorityOptions"
              label="Prioridad"
              variant="outlined"
              required
              :rules="[v => !!v || 'La prioridad es requerida']"
            ></v-select>
            
            <v-select
              v-model="newTask.assignee"
              :items="assigneeOptions"
              label="Asignado a"
              variant="outlined"
            ></v-select>
            
            <v-select
              v-model="newTask.status"
              :items="statusOptions"
              label="Estado"
              variant="outlined"
              required
              :rules="[v => !!v || 'El estado es requerido']"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showNewTaskDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="createNewTask">Crear Tarea</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteTask">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import api from '@/services/api';
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// Task counts
const completedTasks = ref(0);
const inProgressTasks = ref(0);
const pendingTasks = ref(0);
const cancelledTasks = ref(0);

// Task data
const allTasks = ref([]);
const filteredTasks = ref({
  pendiente: [],
  en_progreso: [],
  completada: [],
  cancelada: []
});

// Filter controls
const searchQuery = ref('');
const selectedPriority = ref('Todas');
const selectedAssignee = ref('Todos');

// Dialog controls
const taskDetailsDialog = ref(false);
const showNewTaskDialog = ref(false);
const deleteConfirmDialog = ref(false);
const selectedTask = ref(null);
const newComment = ref('');
const newTaskForm = ref(null);

// New task data
const newTask = ref({
  title: '',
  description: '',
  priority: 'Media',
  assignee: '',
  status: 'pendiente'
});

// Options for selects
const priorityOptions = ['Todas', 'Alta', 'Media', 'Baja'];
const assigneeOptions = ref(['Todos', 'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez']);
const statusOptions = [
  { title: 'Pendiente', value: 'pendiente' },
  { title: 'En Progreso', value: 'en_progreso' },
  { title: 'Completada', value: 'completada' },
  { title: 'Cancelada', value: 'cancelada' }
];

// Check authentication
const checkAuth = () => {
  if (!authStore.isAuthenticated) {
    console.warn('User not authenticated, redirecting to login');
    router.push('/login');
    return false;
  }
  return true;
};

// Get tasks from API
const getTasks = async () => {
  if (!checkAuth()) return;
  
  try {
    const response = await api.getAllTasks();
    const tasks = response.data;
    
    // Count tasks by status
    completedTasks.value = tasks.filter(task => task.status === 'completada').length;
    inProgressTasks.value = tasks.filter(task => task.status === 'en_progreso').length;
    pendingTasks.value = tasks.filter(task => task.status === 'pendiente').length;
    cancelledTasks.value = tasks.filter(task => task.status === 'cancelada').length;
    
    // Store all tasks
    allTasks.value = tasks;
    
    // Apply initial filtering
    filterTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

// Filter tasks based on search query and filters
const filterTasks = () => {
  let filtered = [...allTasks.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query))
    );
  }
  
  // Apply priority filter
  if (selectedPriority.value !== 'Todas') {
    filtered = filtered.filter(task => task.priority === selectedPriority.value);
  }
  
  // Apply assignee filter
  if (selectedAssignee.value !== 'Todos') {
    filtered = filtered.filter(task => task.assignee === selectedAssignee.value);
  }
  
  // Group by status
  filteredTasks.value = {
    pendiente: filtered.filter(task => task.status === 'pendiente'),
    en_progreso: filtered.filter(task => task.status === 'en_progreso'),
    completada: filtered.filter(task => task.status === 'completada'),
    cancelada: filtered.filter(task => task.status === 'cancelada')
  };
};

// Open task details dialog
const openTaskDetails = (task) => {
  selectedTask.value = { ...task };
  taskDetailsDialog.value = true;
};

// Add comment to task
const addComment = () => {
  if (!newComment.value.trim()) return;
  
  if (!selectedTask.value.comments) {
    selectedTask.value.comments = [];
  }
  
  selectedTask.value.comments.push({
    user: 'Usuario Actual',
    user_avatar: 'https://via.placeholder.com/32',
    text: newComment.value,
    date: new Date().toISOString()
  });
  
  newComment.value = '';
};

// Update task status
const updateTaskStatus = async () => {
  if (!checkAuth()) return;
  
  try {
    // Call API to update the task
    await api.updateTask(selectedTask.value.id, {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      status: selectedTask.value.status
    });
    
    // Update the task in the local array
    const taskIndex = allTasks.value.findIndex(t => t.id === selectedTask.value.id);
    if (taskIndex !== -1) {
      allTasks.value[taskIndex].status = selectedTask.value.status;
    }
    
    // Refresh the filtered tasks
    filterTasks();
    
    // Update the counts
    getTasks();
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};

// Update task assignee
const updateTaskAssignee = async () => {
  if (!checkAuth()) return;
  
  try {
    // Call API to update the task
    await api.updateTask(selectedTask.value.id, {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      status: selectedTask.value.status,
      assignee: selectedTask.value.assignee
    });
    
    // Update the task in the local array
    const taskIndex = allTasks.value.findIndex(t => t.id === selectedTask.value.id);
    if (taskIndex !== -1) {
      allTasks.value[taskIndex].assignee = selectedTask.value.assignee;
    }
    
    // Refresh the filtered tasks
    filterTasks();
  } catch (error) {
    console.error('Error updating task assignee:', error);
  }
};

// Update task priority
const updateTaskPriority = async () => {
  if (!checkAuth()) return;
  
  try {
    // Call API to update the task
    await api.updateTask(selectedTask.value.id, {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      status: selectedTask.value.status,
      priority: selectedTask.value.priority
    });
    
    // Update the task in the local array
    const taskIndex = allTasks.value.findIndex(t => t.id === selectedTask.value.id);
    if (taskIndex !== -1) {
      allTasks.value[taskIndex].priority = selectedTask.value.priority;
    }
    
    // Refresh the filtered tasks
    filterTasks();
  } catch (error) {
    console.error('Error updating task priority:', error);
  }
};

// Confirm delete task
const confirmDeleteTask = () => {
  deleteConfirmDialog.value = true;
};

// Delete task
const deleteTask = async () => {
  if (!checkAuth()) return;
  
  try {
    // Call API to delete the task
    await api.deleteTask(selectedTask.value.id);
    
    // Remove the task from the local array
    allTasks.value = allTasks.value.filter(t => t.id !== selectedTask.value.id);
    
    // Close dialogs
    deleteConfirmDialog.value = false;
    taskDetailsDialog.value = false;
    
    // Refresh the filtered tasks and counts
    filterTasks();
    getTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Create new task
const createNewTask = async () => {
  if (!checkAuth()) return;
  
  const { valid } = await newTaskForm.value.validate();
  
  if (!valid) return;
  
  try {
    // Call API to create the task
    const response = await api.registerTask({
      title: newTask.value.title,
      description: newTask.value.description,
      status: newTask.value.status,
      priority: newTask.value.priority,
      assignee: newTask.value.assignee
    });
    
    // Add to the local array
    allTasks.value.push(response.data);
    
    // Reset form and close dialog
    newTask.value = {
      title: '',
      description: '',
      priority: 'Media',
      assignee: '',
      status: 'pendiente'
    };
    
    showNewTaskDialog.value = false;
    
    // Refresh the filtered tasks and counts
    filterTasks();
    getTasks();
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'pendiente': return 'warning';
    case 'en_progreso': return 'primary';
    case 'completada': return 'success';
    case 'cancelada': return 'error';
    default: return 'grey';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'en_progreso': return 'En Progreso';
    case 'completada': return 'Completada';
    case 'cancelada': return 'Cancelada';
    default: return status;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Alta': return 'error';
    case 'Media': return 'warning';
    case 'Baja': return 'success';
    default: return 'grey';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  if (checkAuth()) {
    getTasks();
  }
});
</script>

<style scoped>
.kanban-board {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 16px;
}

.kanban-column {
  flex: 0 0 300px;
  min-width: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.kanban-column-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kanban-column-content {
  padding: 8px;
  overflow-y: auto;
  flex-grow: 1;
}

.task-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bg-warning-lighten-1 {
  background-color: rgba(255, 152, 0, 0.1);
}

.bg-primary-lighten-1 {
  background-color: rgba(33, 150, 243, 0.1);
}

.bg-success-lighten-1 {
  background-color: rgba(76, 175, 80, 0.1);
}

.bg-error-lighten-1 {
  background-color: rgba(244, 67, 54, 0.1);
}
</style>
