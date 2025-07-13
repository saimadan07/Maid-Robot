// Robot Control Center Application
class RobotControlCenter {
    constructor() {
        this.robots = [{
                id: 'milo_x1-2025-07',
                position: {
                    x: 8.65,
                    y: 12.95
                },
                goal: {
                    x: 15,
                    y: 25
                }
            },
            {
                id: 'maid-2025-07',
                position: {
                    x: 12,
                    y: 20
                },
                goal: {
                    x: 12,
                    y: 20
                }
            }
        ];

        this.initializeElements();
        this.bindEvents();
        this.renderRobots();
        this.initializeLucideIcons();
    }

    initializeElements() {
        this.deviceIdInput = document.getElementById('deviceId');
        this.goalXInput = document.getElementById('goalX');
        this.goalYInput = document.getElementById('goalY');
        this.updateBtn = document.getElementById('updateGoalBtn');
        this.successMessage = document.getElementById('successMessage');
        this.successText = document.getElementById('successText');
        this.robotList = document.getElementById('robotList');
    }

    bindEvents() {
        this.updateBtn.addEventListener('click', () => this.handleUpdateGoal());

        // Add enter key support for inputs
        [this.deviceIdInput, this.goalXInput, this.goalYInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUpdateGoal();
                }
            });
        });

        // Add input validation and formatting
        [this.goalXInput, this.goalYInput].forEach(input => {
            input.addEventListener('input', (e) => {
                // Allow decimal numbers
                const value = e.target.value;
                if (value && isNaN(parseFloat(value))) {
                    e.target.value = value.slice(0, -1);
                }
            });
        });
    }

    handleUpdateGoal() {
        const deviceId = this.deviceIdInput.value.trim();
        const goalX = this.goalXInput.value.trim();
        const goalY = this.goalYInput.value.trim();

        // Validation
        if (!deviceId) {
            this.showError('Please enter a device ID');
            return;
        }

        if (!goalX || !goalY) {
            this.showError('Please enter both X and Y coordinates');
            return;
        }

        const parsedX = parseFloat(goalX);
        const parsedY = parseFloat(goalY);

        if (isNaN(parsedX) || isNaN(parsedY)) {
            this.showError('Please enter valid numeric coordinates');
            return;
        }

        // Find and update robot
        const robotIndex = this.robots.findIndex(robot => robot.id === deviceId);

        if (robotIndex === -1) {
            this.showError(`Robot with ID "${deviceId}" not found`);
            return;
        }

        // Update robot goal
        this.robots[robotIndex].goal = {
            x: parsedX,
            y: parsedY
        };

        // Show success message
        this.showSuccess(`Goal updated for ${deviceId}`);

        // Re-render robots
        this.renderRobots();

        // Clear form
        this.clearForm();
    }

    showSuccess(message) {
        this.successText.textContent = message;
        this.successMessage.classList.remove('hidden');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.successMessage.classList.add('hidden');
        }, 3000);
    }

    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'success-message';
        errorDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        errorDiv.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        errorDiv.innerHTML = `
            <i data-lucide="alert-circle" style="width: 1.25rem; height: 1.25rem; color: #ef4444;"></i>
            <span style="color: #fca5a5;">${message}</span>
        `;

        // Insert before form
        const formGrid = document.querySelector('.form-grid');
        formGrid.parentNode.insertBefore(errorDiv, formGrid);

        // Initialize lucide icons for the error message
        lucide.createIcons();

        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    clearForm() {
        this.deviceIdInput.value = '';
        this.goalXInput.value = '';
        this.goalYInput.value = '';
    }

    renderRobots() {
        this.robotList.innerHTML = '';

        this.robots.forEach(robot => {
            const robotElement = this.createRobotElement(robot);
            this.robotList.appendChild(robotElement);
        });

        // Re-initialize lucide icons after rendering
        this.initializeLucideIcons();
    }

    createRobotElement(robot) {
        const robotDiv = document.createElement('div');
        robotDiv.className = 'robot-item';

        robotDiv.innerHTML = `
            <div class="robot-header">
                <i data-lucide="bot" class="robot-icon"></i>
                <h3 class="robot-name">${robot.id}</h3>
            </div>
            
            <div class="robot-info">
                <div class="info-item">
                    <i data-lucide="map-pin" class="position-icon"></i>
                    <span class="info-label">Position:</span>
                    <span class="info-value">(${robot.position.x}, ${robot.position.y})</span>
                </div>
                
                <div class="info-item">
                    <i data-lucide="target" class="goal-icon"></i>
                    <span class="info-label">Goal:</span>
                    <span class="info-value">(${robot.goal.x}, ${robot.goal.y})</span>
                </div>
            </div>
        `;

        return robotDiv;
    }

    initializeLucideIcons() {
        // Initialize lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Method to add new robot (for future expansion)
    addRobot(id, position, goal) {
        const newRobot = {
            id: id,
            position: position || {
                x: 0,
                y: 0
            },
            goal: goal || {
                x: 0,
                y: 0
            }
        };

        this.robots.push(newRobot);
        this.renderRobots();
    }

    // Method to remove robot (for future expansion)
    removeRobot(id) {
        this.robots = this.robots.filter(robot => robot.id !== id);
        this.renderRobots();
    }

    // Method to get robot by ID
    getRobot(id) {
        return this.robots.find(robot => robot.id === id);
    }

    // Method to update robot position (for real-time updates)
    updateRobotPosition(id, position) {
        const robot = this.getRobot(id);
        if (robot) {
            robot.position = position;
            this.renderRobots();
        }
    }
}

// Utility functions
const utils = {
    // Format coordinates for display
    formatCoordinate: (value) => {
        return typeof value === 'number' ? value.toFixed(2) : value;
    },

    // Validate device ID format
    isValidDeviceId: (id) => {
        return id && typeof id === 'string' && id.trim().length > 0;
    },

    // Calculate distance between two points
    calculateDistance: (point1, point2) => {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Check if robot has reached goal (within tolerance)
    hasReachedGoal: (position, goal, tolerance = 0.1) => {
        return utils.calculateDistance(position, goal) <= tolerance;
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.robotControlCenter = new RobotControlCenter();

    // Add some demo functionality
    console.log('Robot Control Center initialized');
    console.log('Available robots:', window.robotControlCenter.robots);

    // Example of how to use the API programmatically:
    // window.robotControlCenter.addRobot('test-robot', {x: 0, y: 0}, {x: 10, y: 10});
    // window.robotControlCenter.updateRobotPosition('milo_x1-2025-07', {x: 9, y: 13});
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RobotControlCenter,
        utils
    };
}