# Hyyume Smart Hydroponics System - Complete System Summary

## Overview
The Hyyume Smart Hydroponics System is a comprehensive IoT solution that monitors and controls hydroponic systems using real-time sensor data. The system consists of an Arduino-based hardware component, a backend API server, and a React-based frontend dashboard.

## System Architecture

### Backend Flow

#### 1. Server Infrastructure
- **Technology**: Node.js with Express.js framework
- **Database**: PostgreSQL for storing sensor data, user information, and system configurations
- **Authentication**: JWT-based authentication with refresh tokens
- **API Endpoint**: `https://api.hyyyume.my.id/api`

#### 2. Data Models
- **Sensor Data Model**: Stores readings from multiple sensors (water temperature, air temperature, humidity, TDS, pH, pump status)
- **User Model**: Manages user accounts, authentication, and subscription status
- **Subscription Model**: Handles user subscription plans and payment status

#### 3. API Routes Structure
- `/auth` - User authentication (register, login, profile)
- `/data` - Sensor data operations (latest data, history, pump control)
- `/subscription` - Payment and subscription management
- `/user` - User profile and settings management

#### 4. Data Collection Process
- Sensors send data to the backend via HTTP requests or WebSocket connections
- Data is validated and stored in PostgreSQL database with timestamps
- Historical data is preserved for trend analysis and visualization
- The system implements hourly data aggregation for efficient long-term storage

#### 5. Authentication Flow
- Users register with email/password credentials
- JWT tokens are issued upon successful authentication
- Middleware validates tokens for protected routes
- Token refresh mechanism maintains user sessions

### Frontend Flow

#### 1. User Interface Technology Stack
- **Framework**: React with Vite build tool
- **State Management**: React Context API for authentication and theme management
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons
- **Animations**: Framer Motion for smooth UI transitions

#### 2. Component Structure
- **Layout Components**: Header, Sidebar with navigation
- **Dashboard Components**: Sensor cards, charts, pump controls, status alerts
- **Auth Components**: Login, registration, email verification forms
- **UI Components**: Reusable card, button, and form components

#### 3. Data Flow from Backend to Frontend
- WebSocket connections for real-time sensor data updates
- Polling mechanism every 3 seconds for latest readings
- Historical data fetch on component mount
- Hourly data aggregation for trend visualization

#### 4. Real-time Updates
- Frontend subscribes to WebSocket events for immediate sensor updates
- Automatic UI refresh when new data is received
- Visual indicators for system status changes

### User Flow

#### 1. Onboarding Flow
1. **Landing Page**: Users view system features and benefits
2. **Registration**: Create account with email and password
3. **Email Verification**: Verify account via email confirmation
4. **Login**: Access dashboard with credentials
5. **Subscription**: Choose a plan for full system access

#### 2. Dashboard Experience
1. **Real-time Monitoring**: 
   - Dashboard displays current sensor readings (water temp, air temp, humidity, TDS, pH)
   - Color-coded indicators show normal vs. warning ranges
   - Last updated timestamp shows data freshness

2. **Historical Data Visualization**:
   - Multiple charts showing trends for each sensor parameter
   - Time range selection for data analysis
   - Hourly data aggregation for daily summaries

3. **Pump Control**:
   - Manual pump on/off controls
   - Confirmation dialogs to prevent accidental operations
   - Status indicators showing current pump state

4. **Navigation**:
   - Sidebar provides access to dashboard, subscription, profile, settings, and daily history
   - Responsive design works on desktop and mobile devices

#### 3. Daily History Page
1. **Date Selection**: Users can select any date to view hourly averages
2. **Trend Analysis**: Charts display hourly average values for each sensor
3. **Data Export**: (Potential future feature) ability to export data
4. **Visual Insights**: Color-coded charts for easy trend identification

#### 4. Profile & Settings
1. **User Profile**: View and edit personal information
2. **System Settings**: Configure notification preferences and units of measurement
3. **Subscription Management**: View current plan and upgrade options
4. **Security**: Change password and manage sessions

### Technical Implementation Details

#### 1. Data Collection & Storage
- **Frequency**: Sensor data collected every 3 seconds (configurable)
- **Aggregation**: Hourly averages calculated and stored for long-term trends
- **Retention**: Configured data retention policies for efficient storage
- **Backup**: Regular database backups for data protection

#### 2. Real-time Communication
- **WebSocket Protocol**: For immediate sensor updates
- **Polling Fallback**: HTTP polling every 3 seconds as backup
- **Connection Resilience**: Automatic reconnection on connection loss
- **Message Queuing**: Handles data bursts during high-frequency readings

#### 3. Security Measures
- **HTTPS**: All API communication encrypted
- **JWT**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Database Sanitization**: Protection against SQL injection

#### 4. Performance Optimization
- **Frontend Caching**: Local caching of user preferences and settings
- **Efficient Charting**: Data sampling for smooth chart rendering
- **Optimized Queries**: Database indexing for fast data retrieval
- **CDN Integration**: Static asset delivery optimization

### System Features

#### 1. Core Monitoring
- Real-time sensor readings display
- Historical data visualization
- Hourly, daily, and weekly trends
- Alert system for out-of-range values

#### 2. Control Capabilities
- Remote pump control
- Automated threshold-based controls (planned feature)
- Scheduling capabilities (planned feature)

#### 3. Analytics & Insights
- Daily average statistics
- Trend analysis
- Comparative historical data
- Performance reports

#### 4. User Management
- Multi-tier subscription plans
- Secure authentication
- Profile management
- Activity logging

### IoT Hardware Integration

#### 1. Arduino-based System
- **Sensors Supported**: Water temperature, air temperature, humidity, TDS, pH
- **Actuators**: Water pump control
- **Communication**: WiFi module for backend connectivity
- **Power Management**: Low-power design for continuous operation

#### 2. Data Transmission
- Secure transmission of sensor readings to backend
- Error handling for failed transmissions
- Data integrity checks
- Time synchronization

This comprehensive system provides hydroponic growers with a complete solution for monitoring and managing their systems remotely, with real-time insights and historical trend analysis to optimize growing conditions.