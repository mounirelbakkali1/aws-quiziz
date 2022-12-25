for (let i = 0; i < 100; i++) {
  let lan = i % 2 == 0 ? "AR" : "EN";
  console.log(
    `INSERT INTO books (id, title, description, unit_cost, isbn, publication_date, num_of_pages, image_url, language) VALUES (NULL, 'book ${i}', 'Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu\'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.', '${
      (i * 10) / 2
    }', '', '2022-12-01', '129', 'images/imag.png', '${lan}');`
  );
}
