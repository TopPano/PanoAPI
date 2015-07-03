clear all
close all

out1 = full_pano_projection('test_01.jpg', 1, 0.3);
figure; imshow(out1); title('Example1');

out2 = full_pano_projection('test_02.jpg', 1, 0.5);
figure; imshow(out2); title('Example2');

out3 = full_pano_projection('test_03.jpg', sqrt(3), 1);
figure; imshow(out3); title('Example3');

out4 = full_pano_projection('test_04.jpg', 1, 0.7);
figure; imshow(out4); title('Example4');