/* ========================================
   THREE-BACKGROUND.JS - 3D Medical-Tech Background
   Author: Joel George Kaudzu Portfolio
======================================== */

class MedicalTechBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.particles = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createGeometries();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0B1120);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 15);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        const container = document.getElementById('hero-background');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);

        // Point lights
        const light1 = new THREE.PointLight(0xD4AF37, 1, 20);
        light1.position.set(5, 5, 5);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0x22D3EE, 1, 20);
        light2.position.set(-5, -3, 5);
        this.scene.add(light2);

        // Directional light
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(1, 2, 1);
        this.scene.add(dirLight);
    }

    createGeometries() {
        // DNA Helix structure
        const helixGroup = new THREE.Group();

        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0x221100,
            shininess: 30,
            transparent: true,
            opacity: 0.8
        });

        const connectorMaterial = new THREE.MeshPhongMaterial({
            color: 0x22D3EE,
            emissive: 0x002233,
            transparent: true,
            opacity: 0.6
        });

        const radius = 2;
        const height = 8;
        const turns = 2;
        const segments = 20;

        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const angle = progress * Math.PI * 2 * turns;
            const y = (progress - 0.5) * height;

            // First strand
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;

            const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), sphereMaterial);
            sphere1.position.set(x1, y, z1);
            helixGroup.add(sphere1);

            // Second strand (opposite)
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), sphereMaterial);
            sphere2.position.set(x2, y, z2);
            helixGroup.add(sphere2);

            // Connectors
            if (i < segments) {
                const nextProgress = (i + 1) / segments;
                const nextAngle = nextProgress * Math.PI * 2 * turns;
                const nextY = (nextProgress - 0.5) * height;

                const nextX1 = Math.cos(nextAngle) * radius;
                const nextZ1 = Math.sin(nextAngle) * radius;

                const nextX2 = Math.cos(nextAngle + Math.PI) * radius;
                const nextZ2 = Math.sin(nextAngle + Math.PI) * radius;

                // Vertical connectors
                this.createLine(helixGroup, x1, y, z1, nextX1, nextY, nextZ1, connectorMaterial);
                this.createLine(helixGroup, x2, y, z2, nextX2, nextY, nextZ2, connectorMaterial);

                // Horizontal connectors (rungs)
                this.createLine(helixGroup, x1, y, z1, x2, y, z2, connectorMaterial);
            }
        }

        helixGroup.position.y = 0;
        this.scene.add(helixGroup);
        this.mesh = helixGroup;
    }

    createLine(group, x1, y1, z1, x2, y2, z2, material) {
        const points = [
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(x2, y2, z2)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        group.add(line);
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;

        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 30;
            posArray[i + 1] = (Math.random() - 0.5) * 30;
            posArray[i + 2] = (Math.random() - 0.5) * 30;

            // Color
            const isGold = Math.random() > 0.5;
            colorArray[i] = isGold ? 0xD4 / 255 : 0x22 / 255;
            colorArray[i + 1] = isGold ? 0xAF / 255 : 0xD3 / 255;
            colorArray[i + 2] = isGold ? 0x37 / 255 : 0xEE / 255;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Rotate main mesh
        if (this.mesh) {
            this.mesh.rotation.y = elapsedTime * 0.1;
            this.mesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
        }

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.02;
        }

        // Pulse lights
        const light1 = this.scene.children.find(child => child instanceof THREE.PointLight);
        if (light1) {
            light1.intensity = 1 + Math.sin(elapsedTime * 2) * 0.3;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize when DOM is loaded and THREE is available
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined' && document.getElementById('hero-background')) {
        new MedicalTechBackground();
    }
});