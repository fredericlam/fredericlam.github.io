<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
//import Navigation from './components/Navigation.vue' ;


</script>

<template>
  
  <header>
    <div class="container-md">
      &lt;social-inequalities/&gt;
    </div>

  </header>

  <main class="page-content container-md">
    
    <router-view />

  </main>

  <footer>
    Footer
  </footer>

</template>

<style lang="scss">
#app {
  font-family: 'Signika Negative', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;

  a{
    color: #2c3e50 ;
    text-decoration: none; 
    &:hover{
      text-decoration: underline;
    }
  }

  header{
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    height: 60px;
    line-height: 60px;
    position: relative;
    img{ 
      max-height: 80px;
    }
  }

  .nav-link{
    color: #0d3453 ; 
  }

  h1,h2,h3,h4,h5,h6{
    font-weight: 700;
  }

  .row+.row {
    margin-top: 1.4rem;
  }

  main.page-content{
    text-align: left ; 
    p{

    }
  }

  footer{
    background: #fff;
    border-top: 1px solid #e2e2e2;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
  }
}
</style>
