##!/usr/bin/env bash
echo -e "Testing deploy"

echo -e "$VARNAME"
echo -e "Pull req"
echo -e "$TRAVIS_PULL_REQUEST"
echo -e "travis:"
echo -e "$TRAVIS"

#if this isn't a pull req set default github token
if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    if [ "$TRAVIS" == "true" ]; then
        git config --global user.email "katja@neontribe.co.uk"
        git config --global user.name "katjam"
    fi
echo -e "Git Hub token"
echo -e "$GH_TOKEN"

#checkout gh_pages branch and update with contents of build folder
git checkout -b gh-pages
cp -r build/* .
git add .
git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to Github Pages"
git remote rm origin
git remote add origin https://c/NuA9r8MkQZkxVs3toPJqGsiYwZ2Somfy+56HnVKQmau00Ydt+er5bmpuCr4oOZHXSBj220aOefTtD2NqlCvHjh4uTlzMUmMO9AM0cBLDJLW0xSMJFmfbotphcsopfw4LJGFAU0qP3wlbrm+ZJDUUy4tX0Es/wj4zLd6YKvqzeZVlTfxNuPC1vZ7+MGIzLa5indvkARjarZY7ORKVNJBf7G2ohXNpjNg85sq9bKxoZ54hyRlToqaKDPLBVdg0qRf9czYR4tSKLH2IQuk7p1cy0X7IJaXgAfnzGuMD1gT8kpS+TFK5CKRRKmmHqFpICcNDPEGmRqu2ZaT2BgdeFQUNNrPGLevGIWmzV+oiciMS27NdXyNcDzzo5fDIW8PA7OIYNeGbZqbxch8Q735y7Lv0o8IXVleuWX//B6g6Rt9iMu8gY2XHtxiphuhuGfvr9g3fp+duY35LcWBylNJ9uMp95fVW+CcDOhEV6KUjOn6XHc+GJAF4SxbchHZO0+zNQ6IYnBuMFVZ+shFgq6AVf9m4eake44N5nruSAkJxYgloo3C6uqYOTfLrDr6VQThDknM058q95yPNl6AiEsdcexWYxIbufHKe6pdtSLv0rJCuL9RyMu+b7cVMRXZ0QxEvejYoYXylyd/OXGBjLCrYzA7FvBGAoIF2vT5er9q17ChlM=@github.com/neontribe/SEAP_ESA.git
git push origin gh-pages
fi
