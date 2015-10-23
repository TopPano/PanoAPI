/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Production grunt tasks need to more time to compile.                    *
   ***************************************************************************/

  hookTimeout: 90000,

  /***************************************************************************
   * Set the host proxy in production environment.                           *
   ***************************************************************************/

  proxyHost: 'helios-ui-0.cloudapp.net',

  /***************************************************************************
   * Port for production environment will depend on the cloud platform       *
   * that the app been deployed. Usually we could get the platform assigned  *
   * port from the environment variable.                                     *
   ***************************************************************************/

  port: process.env.PORT || 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
