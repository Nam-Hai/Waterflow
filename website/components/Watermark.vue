<template>
  <div id="watermark" class="wrapper">
    <div class="container">
      <div>
        <span>A Nam Hai Library</span>
        <span class="daffodil">- Be water</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@use '@/styles/app/colors.scss' as *;

#watermark.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  pointer-events: none;

  .container {
    width: 151.4rem;
    margin: 0 auto;
    padding: 4rem 0;

    >div {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      pointer-events: all;

      span:first-child {
        font-size: 1.5rem;
        margin-bottom: 0.6rem;
        text-transform: uppercase;
      }
    }
  }

}


span.daffodil {
  font-family: 'Daffodil';
  font-size: 6.4rem;
  color: $secondary;
  line-height: 50%;
}
</style>
