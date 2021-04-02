describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Integration tests')
      cy.get('#author').type('Maza Luukkainen')
      cy.get('#url').type('www.getitdone.io')
      cy.get('#createblog').click()

      cy.contains('Integration tests Maza Luukkainen')
    })

    describe('and multiple blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'blog vol 1', author: 'Maza Luukkainen', url: 'www.getitdone1.io' })
        cy.createBlog({ title: 'blog vol 2', author: 'Maza Luukkainen', url: 'www.getitdone2.io', likes: 3 })
        cy.createBlog({ title: 'blog vol 3', author: 'Maza Luukkainen', url: 'www.getitdone3.io', likes: 1 })
      })

      it('a blog can be liked', function () {
        cy.contains('blog vol 2')
          .contains('view')
          .click()

        cy.contains('blog vol 2')
          .parent()
          .contains('likes 3')

        cy.contains('blog vol 2')
          .parent()
          .contains('like')
          .click()

        cy.contains('blog vol 2')
          .parent()
          .contains('likes 4')
      })

      it('a blog can be deleted by the user who added it', function () {
        cy.contains('blog vol 2')
          .contains('view')
          .click()

        cy.contains('blog vol 2')
          .parent()
          .contains('remove')
          .click()

        cy.contains('blog vol 1').should('exist')
        cy.contains('blog vol 2').should('not.exist')
        cy.contains('blog vol 3').should('exist')
      })

      it('the blogs are ordered by their like amounts', function () {
        cy.get('.blog').eq(0).contains('blog vol 2')
        cy.get('.blog').eq(1).contains('blog vol 3')
        cy.get('.blog').eq(2).contains('blog vol 1')

        cy.contains('blog vol 1').contains('view').click()
        cy.contains('blog vol 1').parent().contains('like').click()
        cy.contains('blog vol 1').parent().contains('like').click()

        cy.get('.blog').eq(0).contains('blog vol 2')
        cy.get('.blog').eq(1).contains('blog vol 1')
        cy.get('.blog').eq(2).contains('blog vol 3')

        cy.contains('blog vol 1').parent().contains('like').click()
        cy.contains('blog vol 1').parent().contains('like').click()

        cy.get('.blog').eq(0).contains('blog vol 1')
        cy.get('.blog').eq(1).contains('blog vol 2')
        cy.get('.blog').eq(2).contains('blog vol 3')
      })
    })
  })
})