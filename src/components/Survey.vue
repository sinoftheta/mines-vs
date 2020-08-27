<template>

    <div class="container mt-5">
        <div class="alert alert-warning text-center text-dark" role="alert">
            <div class='h5'>Instructions</div>
            Use the form below to rate the performance of you and your team members for the assignment.
         </div>
        <div class="card">
            <div class='card-header'>
                <div class='h4'>Aldebaran :  Assignment 1</div>
            </div>
            <div class="card-body">
                
                <table class="table table-striped text-center">
                    <thead>
                      <tr>
                        <th scope="col">Team Member</th>
                        <th scope="col">1<br><small>Greatly Below Expectations</small></th>
                        <th scope="col">2<br><small>Below Expectations</small></th>
                        <th scope="col">3<br><small>Met Expectations</small></th>
                        <th scope="col">4<br><small>Exceeded Expectations</small></th>
                        <th scope="col">5<br><small>Greatly Exceeded Expectations</small></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Kenzie</th>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="firstStudent" id="firstStudent1" value="firstStudentOption1" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="firstStudent" id="firstStudent2" value="firstStudentOption2" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="firstStudent" id="firstStudent3" value="firstStudentOption3" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="firstStudent" id="firstStudent4" value="firstStudentOption4" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="firstStudent" id="firstStudent5" value="firstStudentOption5" aria-label="...">
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Nick B.</th>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="secondStudent" id="secondStudent1" value="secondStudentOption1" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="secondStudent" id="secondStudent2" value="secondStudentOption2" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="secondStudent" id="secondStudent3" value="secondStudentOption3" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="secondStudent" id="secondStudent4" value="secondStudentOption4" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="secondStudent" id="secondStudent5" value="secondStudentOption5" aria-label="...">
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Ian</th>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="thirdStudent" id="blankRadio1" value="option1" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="thirdStudent" id="blankRadio2" value="option2" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="thirdStudent" id="blankRadio3" value="option3" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="thirdStudent" id="blankRadio4" value="option4" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="thirdStudent" id="blankRadio5" value="option5" aria-label="...">
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Nick S.</th>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="fourthStudent" id="blankRadio1" value="option1" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="fourthStudent" id="blankRadio2" value="option2" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="fourthStudent" id="blankRadio3" value="option3" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="fourthStudent" id="blankRadio4" value="option4" aria-label="...">
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="radio" name="fourthStudent" id="blankRadio5" value="option5" aria-label="...">
                            </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
            </div>
            <div class="card-footer text-right">
                <button type="button" class="btn btn-lg btn-primary text-right">Submit</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Survey',
    computed: {
        group(){
            return this.$store.state.group;
        }
    }
}

</script>
<style scoped>
    .form-check-input {
        transform: scale(2);
    }
</style>