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

  <!--<footer>
    Footer
  </footer>-->

</template>

<style lang="scss">

$font : 'Signika Negative', sans-serif ;
#app {
  font-family: $font ;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;

  svg{
    text{
      font-family: $font ;
    }
  }

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
    width: 100%;
    height: 60px;
    line-height: 60px;
  }
}

.tooltip_viz{
    background: #f5f5f5;
    border: solid 1px #eee;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) ;
    color: #333;
    display: none;
    left: 130px;
    padding: 10px ;
    max-width: 250px ; 
    width: 220px;
    position: absolute;
    text-align: center;
    top: 95px;
    z-index: 10;
    h5{
        margin: 0 ; 
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 4px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100% ; 
        text-align: left ;
    }
    table{
        border:none ; 
        width: 100% ; 
        font-size: 12px ; 
        tr{
            border-bottom: dotted 1px #cccccc ; 
            padding: 3px 0 ; 
            td.metric{
              text-align: left;
              padding-right: 10px ;  
              span.separator{
                display: block ; 
                width: 5px ; 
                margin: 2px 5px 2px 0 ; 
                float: left ; 
                height: 100% ; 
                min-height: 12px ; 
              }
            }

            td.value{
                font-weight: bold ; 
                text-align: right ; 
            }
        }
    }
    .g-tip-caret {
        position: absolute;
        bottom: -5.5px;
        fill: #fff;
        stroke: none;
    }      

    &:after{
      content: " ";
      position: absolute;
      left: 50%; 
      margin-left:-7px;
      bottom: -6px;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 15px solid transparent;
      border-top: 15px solid #f5f5f5;
    }

    .label{
        color: rgba(0,0,0,0.87) ;
        display: inline-block ; 
        font-size: 12px;
        padding: 5px 5px 0px 5px ;
        font-weight: 600; 
        span{
          display:inline-block; 
          text-align:left ;
          margin: 0 5px 5px 0 ;
        }
        h4{
            font-size: 1em ; 
            text-align:left ;
        }
        ol{
            padding-left: 20px ; 
            li{
                padding-left: 5px; 
                text-align:left ;
                font-weight: 400 ; 
            }
        }
      }
      table.val_tooltip{
        tr{
            td{
                background: #fff ; 
                border: solid 1px black ; 
                padding: 3px 10px ; 
                vertical-align: top ; 
            }
        }
    }
}
</style>
