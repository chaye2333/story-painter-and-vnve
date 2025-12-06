<template>
  <div class="steampunk-layer absolute inset-0 overflow-hidden pointer-events-none select-none">
    
    <!-- 1. Deep Background: Giant Rotating Ring (The World Engine) -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] w-[80vh] h-[80vh] z-0">
      <svg viewBox="0 0 200 200" class="w-full h-full animate-spin-super-slow">
        <circle cx="100" cy="100" r="90" fill="none" stroke="white" stroke-width="1" stroke-dasharray="10, 5" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="white" stroke-width="0.5" />
        <path d="M100 10 L100 190 M10 100 L190 100" stroke="white" stroke-width="0.5" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="white" stroke-width="2" stroke-dasharray="2, 4" />
      </svg>
    </div>

    <!-- 2. Industrial Horizon (Behind City) -->
    <div class="absolute bottom-0 left-0 w-full h-[30vh] opacity-10 flex items-end justify-around z-0">
      <div class="relative w-20 h-full mx-10">
        <div class="absolute bottom-0 left-2 w-2 h-[80%] border-l border-r border-white/50 bg-black/50"></div>
        <div class="absolute bottom-0 left-8 w-4 h-[60%] border-l border-r border-white/50 bg-black/50"></div>
      </div>
      <div class="relative w-32 h-[70%] mx-20 hidden md:block">
         <div class="absolute bottom-0 left-0 w-full h-full border-t border-l border-r border-white/30 rounded-t-full"></div>
         <div class="absolute bottom-10 left-1/2 -translate-x-1/2 w-2 h-[100vh] bg-white/10"></div>
      </div>
      <div class="relative w-16 h-[50%] mx-5">
         <div class="absolute bottom-0 left-4 w-2 h-full border-l border-r border-white/50 bg-black/50"></div>
         <!-- Smoke coming out -->
         <div class="absolute -top-10 left-0 w-10 h-20 bg-white/5 blur-xl rounded-full animate-pulse"></div>
      </div>
    </div>

    <!-- 3. Gear System Top Left -->
    <div class="absolute -top-20 -left-20 opacity-10 z-10">
      <svg width="300" height="300" viewBox="0 0 100 100" class="animate-spin-slow">
        <!-- Simple Gear Path -->
        <path d="M50 0 L55 10 L65 10 L70 0 L80 5 L75 15 L85 20 L95 15 L98 25 L88 30 L92 40 L100 45 L98 55 L88 58 L90 68 L100 72 L95 82 L85 78 L80 88 L70 85 L65 95 L55 90 L50 100 L45 90 L35 95 L30 85 L20 88 L15 78 L5 82 L0 72 L10 68 L12 58 L2 55 L0 45 L8 40 L12 30 L2 25 L5 15 L15 20 L25 15 L20 5 L30 0 L35 10 L45 10 Z" 
              fill="none" stroke="white" stroke-width="1" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="1" />
        <circle cx="50" cy="50" r="5" fill="white" />
      </svg>
    </div>

    <!-- Bottom Right Gears Removed -->

    <!-- 6. Lever System Left Side -->
    <div class="absolute top-1/3 -left-10 opacity-15 w-40 h-60 z-10">
       <div class="relative w-full h-full">
          <!-- Piston Housing -->
          <div class="absolute left-10 top-0 w-4 h-40 border border-white/50 bg-black"></div>
          <!-- Piston Rod (Moving) -->
          <div class="absolute left-11 top-0 w-2 h-20 bg-white/20 animate-piston-move"></div>
          
          <!-- Connecting Rod -->
          <svg class="absolute left-12 top-10 w-40 h-40 overflow-visible" style="transform-origin: 0 0;">
             <line x1="0" y1="0" x2="50" y2="50" stroke="white" stroke-width="1" class="animate-rod-swing" />
             <circle cx="50" cy="50" r="3" fill="white" class="animate-joint-move" />
          </svg>
       </div>
    </div>
    
    <!-- 7. Floating Cogs Background (Randomly placed) -->
    <div class="absolute top-1/4 right-1/4 opacity-5 z-0">
       <svg width="100" height="100" viewBox="0 0 100 100" class="animate-spin-slow">
          <circle cx="50" cy="50" r="40" stroke="white" stroke-width="1" stroke-dasharray="5,5" />
          <circle cx="50" cy="50" r="20" stroke="white" stroke-width="1" />
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" stroke-width="1" />
       </svg>
    </div>

    <!-- 8. Steam Particles -->
    <div class="absolute inset-0 pointer-events-none z-20">
      <div class="steam-particle p1" style="left: 20%; bottom: 0;"></div>
      <div class="steam-particle p2" style="left: 50%; bottom: -10%; animation-delay: 2s;"></div>
      <div class="steam-particle p3" style="left: 80%; bottom: 0; animation-delay: 4s;"></div>
      <div class="steam-particle p4" style="left: 10%; bottom: -20%; animation-delay: 6s;"></div>
    </div>

  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 20s linear infinite;
}

.animate-spin-super-slow {
  animation: spin 120s linear infinite;
}

.animate-spin-reverse-slow {
  animation: spin 25s linear infinite reverse;
}

.animate-piston-move {
  animation: piston 4s ease-in-out infinite alternate;
}

.animate-rod-swing {
  animation: swing 4s ease-in-out infinite alternate;
  transform-origin: 0 0;
}

.animate-joint-move {
  animation: joint 4s ease-in-out infinite alternate;
}

.steam-particle {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: rise 10s infinite linear;
  opacity: 0;
  filter: blur(10px);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes piston {
  0% { height: 20px; top: 10px; }
  100% { height: 60px; top: 40px; }
}

@keyframes swing {
  0% { transform: rotate(-15deg); }
  100% { transform: rotate(15deg); }
}

@keyframes joint {
  0% { transform: translate(-10px, 0); } 
  100% { transform: translate(10px, 20px); }
}

@keyframes rise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  20% { opacity: 0.2; }
  80% { opacity: 0.2; }
  100% { transform: translateY(-300px) scale(1.5); opacity: 0; }
}
</style>
