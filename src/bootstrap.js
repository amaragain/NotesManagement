module.exports = async () => {

    const { exec } = require('child_process');

    await new Promise((resolve, reject) => {
        const migrate = exec(
            'sequelize db:migrate',
            { env: process.env },
            err => (err ? reject(err) : resolve())
        );

        // Forward stdout+stderr to this process
        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });


}