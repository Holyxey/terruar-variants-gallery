<template>
  <div :class="['pointer-events-none absolute']">
    <svg
      class="scroll-hand absolute transition-all"
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9199 0.5C13.3025 0.500262 14.4199 1.61735 14.4199 3V16.7041L18.4033 15.8701C19.0262 15.7365 19.6718 15.919 20.1416 16.334L20.2334 16.4199L20.2373 16.4238C21.0004 17.2048 21.0004 18.4486 20.2373 19.2295L14.8818 24.585C14.3204 25.1316 13.5777 25.4576 12.7959 25.4961L12.6396 25.5H4.50586C2.92341 25.4999 1.59261 24.3428 1.37109 22.7764L0.53125 16.8164C0.341373 15.4711 1.03625 14.141 2.25781 13.5381L7.69629 10.832C8.13931 10.6106 8.61624 10.5 9.10645 10.5H9.41992V3C9.41992 1.61719 10.5371 0.5 11.9199 0.5Z"
        fill="white"
        stroke="#221B11"
      />
    </svg>
  </div>
</template>

<style>
  .scroll-hand {
    animation: scroll-hand 3s infinite;
  }
  @keyframes scroll-hand {
    from {
      right: 15px;
      top: -20px;
      scale: 1;
      opacity: 0;
    }
    15% {
      right: 10px;
      top: -10px;
      scale: 1;
      opacity: 1;
    }
    20% {
      scale: 0.8;
      rotate: 0;
    }
    70% {
      right: 53px;
      scale: 0.8;
      opacity: 1;
      top: -10px;
      rotate: 20deg;
    }
    to {
      opacity: 0;
      right: 59px;
      top: -10px;
    }
  }
</style>
