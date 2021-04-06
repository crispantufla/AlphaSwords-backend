const initCategory = (Category) => {

    const data = [
        {
            name: "Misterio y Suspense"
        },
        {
            name: "Ciencia Ficción"
        },
        {
            name: "Humor y sátira"
        },
        {
            name: "Terror"
        },
        {
            name: "Acción"
        },
        {
            name: "Romance"
        },
        {
            name: "Infantiles"
        },
        {
            name: "Salud y bienestar"
        },
    ];

    Category.countDocuments()
    .then((count) => {
        if (count === 0) {
            data.forEach(category => {
                Category.create(category).then(docCategory => {
                    console.log('\n Created Category: \n' + docCategory);
                    return docCategory
                });
            });
        }
    })
}

module.exports = {initCategory};