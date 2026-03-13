function generarContraseña() {
    // Obtener los valores de configuración
    const length = parseInt(document.getElementById('length').value);
    const uppercase = document.getElementById('uppercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;
    
    // Validar que al menos una opción esté seleccionada
    if (!uppercase && !numbers && !symbols) {
        mostrarMensaje('Selecciona al menos una opción', 'error');
        return;
    }
    
    // Definir los conjuntos de caracteres
    let caracteres = 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) caracteres += '0123456789';
    if (symbols) caracteres += '!@#$%^&*()_+[]{}|;:,.<>?';
    
    // Generar la contraseña
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        password += caracteres.charAt(randomIndex);
    }
    
    // Mostrar la contraseña en el campo de texto
    document.getElementById('password').value = password;
    
    // Calcular y mostrar la seguridad de la contraseña
    calcularSeguridad(password);
    
    // Efecto visual sutil para indicar generación (sin cambiar fondo)
    const container = document.querySelector('.container');
    container.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    setTimeout(() => {
        container.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    }, 300);
}

function copiarContraseña() {
    const passwordField = document.getElementById('password');
    
    // Verificar si hay una contraseña para copiar
    if (!passwordField.value) {
        mostrarMensaje('No hay contraseña para copiar', 'error');
        return;
    }
    
    // Usar el API moderno de Clipboard si está disponible
    if (navigator.clipboard) {
        navigator.clipboard.writeText(passwordField.value)
            .then(() => mostrarMensaje('¡Contraseña copiada!'))
            .catch(err => mostrarMensaje('Error al copiar', 'error'));
    } else {
        // Método alternativo como fallback
        passwordField.select();
        document.execCommand('copy');
        mostrarMensaje('¡Contraseña copiada!');
    }
}

function mostrarMensaje(texto, tipo = 'success') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = texto;
    messageElement.className = 'message show-message';
    
    if (tipo === 'error') {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
    } else {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
    }
    
    setTimeout(() => {
        messageElement.className = 'message';
    }, 3000);
}

function createStars() {
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(star);
    }
}

// Actualizar el valor mostrado del slider
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');

lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
});

// Generar una contraseña inicial al cargar la página
window.addEventListener('load', function() {
    generarContraseña();
    createStars();
});

function calcularSeguridad(password) {
    let score = 0;
    const length = password.length;
    
    // Puntos por longitud (máx 40%)
    if (length >= 6) score += 10;
    if (length >= 8) score += 10;
    if (length >= 12) score += 10;
    if (length >= 16) score += 10;
    
    // Puntos por tipos de caracteres (máx 60%)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);
    
    const types = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    score += types * 15; // 15% por cada tipo
    
    // Ajuste especial: si longitud 6-10 y solo minúsculas + mayúsculas, baja seguridad
    if (length <= 10 && types === 2 && hasLower && hasUpper && !hasNumber && !hasSymbol) {
        score = 20; // Forzar baja
    }
    
    // Limitar a 100%
    score = Math.min(score, 100);
    
    // Actualizar barra
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    
    bar.style.width = score + '%';
    
    if (score < 30) {
        bar.style.backgroundColor = '#ff6b6b'; // Rojo
        text.textContent = 'Débil';
    } else if (score < 60) {
        bar.style.backgroundColor = '#ffa500'; // Naranja
        text.textContent = 'Media';
    } else if (score < 80) {
        bar.style.backgroundColor = '#00d4ff'; // Azul
        text.textContent = 'Fuerte';
    } else {
        bar.style.backgroundColor = '#00ff88'; // Verde
        text.textContent = 'Muy Fuerte';
    }
}