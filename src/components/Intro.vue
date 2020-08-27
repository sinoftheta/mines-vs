<template>
    <div class='container mt-5'>
        <div class='row justify-content-center'>
            <div class='col-6'>
                <div class='card'>
                    <div class='card-header text-center'>
                        <div class='h4'>CS 352 - Group Survey</div>
                    </div>
                    <div class='card-body text-center p-3'>
                        <div class='font-weight-bold'>Welcome, Nick Breslin.</div>
                        <div class='font-weight-bold mb-3'>Group: Aldebaran</div>
                        <p class='p-0 m-0'>
                            In this survey, you will rate the performance of yourself and your team members for <strong>Assignment 1</strong>.
                        </p>
                    </div>
                    <div class='card-footer text-center'>
                        <button type='button' class='btn btn-lg btn-primary'>Begin Survey</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Intro',
  computed: {
      title(){
          return 'Assignment Title';
      }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
