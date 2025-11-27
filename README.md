# MechaMind Analytics 🏭 
### Dashboard de Mantenimiento Predictivo con React + Google Gemini

Este es un proyecto educativo de **Data Analytics y Business Intelligence (BI)** aplicado a la **Mecatrónica**. Simula el monitoreo de un motor industrial en tiempo real y utiliza Inteligencia Artificial para diagnosticar fallas.

## 🎯 Objetivo del Proyecto
Demostrar cómo integrar visualización de datos web (Frontend) con análisis avanzado de IA (Backend/API) sin necesidad de hardware físico costoso.

## 🛠 Herramientas Utilizadas (100% Virtuales & Gratuitas)
1.  **React & TypeScript:** Para la interfaz de usuario y lógica de simulación.
2.  **Tailwind CSS:** Para el diseño profesional tipo "SCADA".
3.  **Recharts:** Librería de gráficos para visualización de series temporales.
4.  **Google Gemini API:** "Cerebro" del sistema que analiza los datos numéricos y genera reportes en lenguaje natural.

---

## 🚀 Conceptos Clave de Análisis de Datos

### 1. Series Temporales (Time Series)
Los sensores de un motor (temperatura, vibración) generan datos secuenciales en el tiempo. En este dashboard, usamos gráficos de líneas para visualizar la **tendencia** y detectar si una variable está subiendo peligrosamente.

### 2. Detección de Anomalías
Es el proceso de identificar datos que se desvían de la norma.
*   **Umbral Estático:** Si la temperatura > 80°C, es una anomalía (lógica programada en `simulation.ts`).
*   **Análisis IA:** Gemini detecta patrones complejos, como una vibración que sube lentamente *antes* de llegar al umbral crítico.

### 3. Digital Twin (Gemelo Digital)
Este software actúa como una representación virtual de un motor real. Permite probar escenarios de falla ("Falla Térmica", "Desbalanceo") sin dañar una máquina real.

---

## 🧪 Cómo usar este proyecto

### Paso 1: Exploración de Datos (Python/Google Colab)
Antes de construir el dashboard, un analista de datos usaría Python para entender los datos. Puedes copiar este script y ejecutarlo en [Google Colab](https://colab.research.google.com/) para ver cómo se generan los datos "crudos".

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Simulación de 100 segundos de un motor sobrecalentándose
time = np.arange(0, 100)
temp = 45 + (time * 0.5) + np.random.normal(0, 0.5, 100) # Tendencia lineal + ruido
vibration = 2.5 + np.random.normal(0, 0.2, 100)

df = pd.DataFrame({'Tiempo': time, 'Temperatura': temp, 'Vibracion': vibration})

# Visualización básica
plt.figure(figsize=(10,5))
plt.plot(df['Tiempo'], df['Temperatura'], label='Temperatura', color='red')
plt.axhline(y=80, color='black', linestyle='--', label='Umbral Crítico')
plt.title('Análisis Exploratorio: Simulación de Falla')
plt.legend()
plt.show()
```

### Paso 2: El Dashboard Web (Este Proyecto)
El código de este repositorio lleva ese análisis a una **Web App en Tiempo Real**.

1.  Inicia la aplicación. Verás los gráficos avanzando.
2.  Usa los botones superiores para inyectar fallas:
    *   **Normal:** El motor opera estable.
    *   **Falla Térmica:** La temperatura sube rápidamente.
    *   **Desbalanceo:** La vibración se vuelve errática y alta.
3.  Presiona el botón **"Generar Reporte IA"**.
    *   El sistema tomará los últimos 10 segundos de datos.
    *   Los enviará a Google Gemini.
    *   Gemini responderá con un diagnóstico técnico (ej: "Se detecta un incremento térmico no correlacionado con la carga, posible falla de lubricación").

---

## 📁 Estructura del Código

*   `App.tsx`: Cerebro de la aplicación. Controla el bucle de tiempo y refresca los datos cada segundo.
*   `utils/simulation.ts`: Contiene las "Leyes Físicas" de nuestro motor virtual.
*   `services/gemini.ts`: Función asíncrona que conecta con la API de Google para interpretar los JSONs.
*   `components/`: Piezas de UI reutilizables (Tarjetas de KPI, Gráficos).

## 🎓 Conclusión
Este proyecto demuestra habilidades fundamentales para la Industria 4.0:
1.  Recolección de datos.
2.  Visualización para toma de decisiones.
3.  Integración de IA para mantenimiento prescriptivo.
